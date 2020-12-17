import { ITimestamp, IEntity, IEmbedCoupon } from './index';
import { IDocumentReference } from '@/infra/database/types';

enum IBookingStatus {
    AVAILABLE = 'available',
    ONHOLD = 'onhold',
    PROCESSING = 'processing',
    BOOKED = 'booked'
}

export const BOOKING_TYPES = ['course', 'session'] as const;
export const BOOKING_PAYMENT_METHOD = ['momo', 'vnpay'] as const;

type IBookingType = typeof BOOKING_TYPES[number];
type IBookingPaymentMethod = typeof BOOKING_PAYMENT_METHOD[number];

type IBooking = {
    paymentMethod: IBookingPaymentMethod;

    orderId: string;

    coupon: IEmbedCoupon | null;

    amount: number;

    type: IBookingType;

    object: any;

    student: IDocumentReference;

    bookedDate: Date;

    status: IBookingStatus;
};

type IBookingEntity = IEntity & IBooking & ITimestamp;

export { IBookingStatus, IBookingType, IBookingPaymentMethod, IBooking, IBookingEntity };
