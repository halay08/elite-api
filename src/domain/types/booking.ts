import { ITimestamp, IEntity, IEmbedCoupon, ISession } from '.';
import { IDocumentReference } from '@/infra/database/types';

const BOOKING_PAYMENT_METHOD = ['momo', 'vnpay'] as const;

type IBookingPaymentMethod = typeof BOOKING_PAYMENT_METHOD[number];

enum BookingStatus {
    AVAILABLE = 'available',
    ONHOLD = 'onhold',
    PROCESSING = 'processing',
    BOOKED = 'booked'
}

type IBookingSession = Pick<ISession, 'startTime' | 'duration' | 'cost' | 'costType'>;

type IBooking = {
    paymentMethod: IBookingPaymentMethod;

    orderId: string;

    transactionId: string; // momo | vnpay transaction id

    coupon?: IEmbedCoupon | null;

    // Tutor reference
    // The reference point to tutor collection
    tutor: IDocumentReference;

    // Origin session reference. It's origin because the session may be re-scheduled by tutor.
    // The reference point to session collection
    originSession: IDocumentReference;

    // The data use to store booked session histories.
    bookingSession: IBookingSession;

    amount: number; // Total amount after using discount

    student: IDocumentReference;

    bookedDate: Date;

    status: BookingStatus;
};

type IBookingEntity = IEntity & IBooking & ITimestamp;

export { BookingStatus, IBooking, IBookingEntity, IBookingSession, IBookingPaymentMethod, BOOKING_PAYMENT_METHOD };
