import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/infra/database/types';

type IBookingPayment = {
    booking: IDocumentReference;

    paymentMethod: 'momo' | 'vnpay';

    orderId: string;

    amount: number;
};

/**
 * Booking Payment entity
 */
type IBookingPaymentEntity = IEntity & IBookingPayment & ITimestamp;

export { IBookingPayment, IBookingPaymentEntity };
