import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';
import { IBookingEntity, IPaymentMethodEntity } from '.';

export type IBookingPayment = {
    booking: Pick<IBookingEntity, '_id' | 'bookingNumber'>;

    paymentMethod: Pick<IPaymentMethodEntity, '_id' | 'name'>;

    /**
     * Momo/VNPAY order id
     */
    orderId: string;

    /**
     * Momo/VNPAY transaction id
     */
    transactionId: string;

    amount: number;
};

/**
 * Booking Payment entity
 */
export type IBookingPaymentEntity = domain.IEntity & IBookingPayment & domain.ITimstamp;

// Collection: booking_payment
@injectable()
export default class BookingPayment extends Entity<IBookingPaymentEntity> {
    constructor(props: IBookingPayment, _id?: string) {
        super(props, _id);
    }
}
