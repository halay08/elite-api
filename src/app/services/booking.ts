//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import * as cuid from 'cuid';
import { inject } from 'inversify';
import { fireauth } from '@/infra/auth/firebase/types';
import { provide } from 'inversify-binding-decorators';
import { Booking, LearningStack } from '@/domain';
import { IBookingSession, BookingStatus, CostType, LearningStatus } from '@/domain/types';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';
import {
    IRepository,
    IBookingRepository,
    ITutorRepository,
    IStudentRepository,
    ISessionRepository
} from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { BookingDTO } from '@/api/http/requests';
import { BaseService, CouponService, LearningStackService } from '.';
import { COLLECTIONS } from '@/src/infra/database/config/collection';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.BookingService)
export class BookingService extends BaseService<Booking> {
    @inject(TYPES.CouponService) private readonly couponService: CouponService;
    @inject(TYPES.LearningStackService) private readonly learningStackService: LearningStackService;
    @inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository;
    @inject(TYPES.StudentRepository) private readonly studentRepository: IStudentRepository;
    @inject(TYPES.SessionRepository) private readonly sessionRepository: ISessionRepository;
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Booking> {
        return Container.get<IBookingRepository>(TYPES.BookingRepository);
    }

    public async createBooking(
        { paymentMethod, coupon, amount, transactionId, sessionId, tutorId, bookedDate }: BookingDTO,
        user: fireauth.IUserRecord
    ): Promise<string> {
        const userRef = this.getDocumentRef(`${COLLECTIONS.User}/${user.uid}`);
        const session = await this.sessionRepository.findById(sessionId);
        const tutor = await this.tutorRepository.findById(tutorId);
        const [student] = (await this.studentRepository.findBy('user', userRef)) || [];

        if (!session || !tutor || !student) {
            throw new NotFoundError('Invalid booking reference fields');
        }

        const orderId = cuid();

        const sessionRef = this.getDocumentRef(`${COLLECTIONS.Session}/${session.id}`);
        const tutorRef = this.getDocumentRef(`${COLLECTIONS.Tutor}/${tutor.id}`);
        const studentRef = this.getDocumentRef(`${COLLECTIONS.Student}/${student.id}`);

        const bookingSession: IBookingSession = {
            startTime: session.startTime,
            duration: session.duration,
            cost: session.cost,
            costType: CostType.CASH
        };

        const getCoupon = coupon ? await this.couponService.verifyCoupon(coupon) : null;
        // TODO: Need to calculate amount here based on coupon.
        // There are two types of coupon: percentage & subtract amount

        const model = Booking.create({
            orderId,
            transactionId,
            coupon: getCoupon,
            student: studentRef,
            tutor: tutorRef,
            originSession: sessionRef,
            bookingSession: bookingSession,
            amount,
            bookedDate,
            paymentMethod,
            status: BookingStatus.BOOKED
        });

        const booking = await this.create(model);

        if (!booking) {
            throw new Error(`Couldn't create booking record`);
        }

        // Create learning stack record
        const bookingRef = this.baseRepository.getDocumentRef(`${COLLECTIONS.Booking}/${booking.id}`);
        const learningStack = LearningStack.create({
            booking: bookingRef,
            student: studentRef,
            tutor: tutorRef,
            status: LearningStatus.BOOKED
        });
        await this.learningStackService.create(learningStack);

        // Notification & email
        const data = {
            name: user.displayName,
            orderId
        };
        const notification = new EmailAdapter(user.email as string, TemplateType.BOOKING, data, Vendor.GMAIL);
        notification.send();

        return orderId;
    }
}
