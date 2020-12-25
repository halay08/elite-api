//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { inject } from 'inversify';
import { fireauth } from '@/infra/auth/firebase/types';
import { provide } from 'inversify-binding-decorators';
import { Booking } from '@/domain';
import { IBookingSession, BookingStatus, CostType } from '@/domain/types';
import * as nanoid from 'nanoid';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';
import { IRepository, IBookingRepository, ISessionRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { BookingDTO } from '@/api/http/requests';
import { BaseService, CouponService } from '.';
import { COLLECTIONS } from '@/src/infra/database/config/collection';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.BookingService)
export class BookingService extends BaseService<Booking> {
    @inject(TYPES.CouponService) private readonly couponService: CouponService;
    @inject(TYPES.SessionRepository) private readonly sessionRepository: ISessionRepository;
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Booking> {
        return Container.get<IBookingRepository>(TYPES.BookingRepository);
    }

    /**
     * Generate unique order id
     *
     * @returns string
     * @memberof PaymentService
     */
    public generateOrderId(): string {
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const orderId = nanoid.customAlphabet(alphabet, 10);
        return orderId();
    }

    public async createBooking(
        { paymentMethod, coupon, amount, sessionId, tutorId, bookedDate }: BookingDTO,
        user: fireauth.IUserRecord
    ): Promise<string> {
        const studentRef = this.getDocumentRef(`${COLLECTIONS.User}/${user.uid}`);
        const session = await this.sessionRepository.findById(sessionId);

        if (!session || !studentRef) {
            throw new NotFoundError('Invalid booking reference fields');
        }

        const orderId = this.generateOrderId();

        const sessionRef = this.getDocumentRef(`${COLLECTIONS.Session}/${session.id}`);

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
            coupon: getCoupon,
            student: studentRef,
            tutor: session.tutor,
            originSession: sessionRef,
            bookingSession: bookingSession,
            amount,
            bookedDate,
            paymentMethod,
            status: BookingStatus.PROCESSING
        });

        const booking = await this.create(model);

        if (!booking) {
            throw new Error(`Couldn't create booking record`);
        }

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
