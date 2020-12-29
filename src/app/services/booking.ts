//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { inject } from 'inversify';
import { fireauth } from '@/infra/auth/firebase/types';
import { provide } from 'inversify-binding-decorators';
import { Booking } from '@/domain';
import { IBookingSession, BookingStatus, CostType } from '@/domain/types';
import * as nanoid from 'nanoid';
import {
    IRepository,
    IBookingRepository,
    ISessionRepository,
    IUserRepository
} from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { BookingDTO } from '@/api/http/requests';
import { BaseService } from '.';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.BookingService)
export class BookingService extends BaseService<Booking> {
    @inject(TYPES.SessionRepository) private readonly sessionRepository: ISessionRepository;
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
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

    /**
     * Get booking by orderId which was generated from the function generateOrderId
     *
     * @param {string} orderId
     * @returns
     * @memberof BookingService
     */
    public async getBookingByOrderId(orderId: string): Promise<Booking> {
        const query = await this.findBy('orderId', orderId);
        const [booking]: Array<Booking> = query || [];

        if (!booking) throw new NotFoundError('Booking is not found');

        return booking;
    }

    /**
     * Create a booking
     *
     * @param {BookingDTO} { paymentMethod, coupon, amount, sessionId, tutorId, bookedDate }
     * @param {fireauth.IUserRecord} user
     * @returns {Promise<string>}
     * @memberof BookingService
     */
    public async createBooking(
        { paymentMethod, amount, sessionId, bookedDate }: BookingDTO,
        user: fireauth.IUserRecord
    ): Promise<string> {
        const sessionData = await this.sessionRepository.findById(sessionId);
        const session = sessionData.serialize();

        const orderId = this.generateOrderId();
        const studentRef = this.userRepository.getDocumentRef(`${user.uid}`);
        const tutorRef = this.userRepository.getDocumentRef(`${session.tutor.id}`);
        const sessionRef = this.sessionRepository.getDocumentRef(`${session.id}`);

        const bookingSession: IBookingSession = {
            startTime: session.startTime,
            duration: session.duration,
            cost: session.cost,
            costType: CostType.CASH
        };

        // TODO: Need to calculate amount here based on coupon.
        // const getCoupon = coupon ? await this.couponService.verifyCoupon(coupon) : null;
        // There are two types of coupon: percentage & subtract amount

        const model = Booking.create({
            orderId,
            coupon: null,
            student: studentRef,
            tutor: tutorRef,
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

        return orderId;
    }
}
