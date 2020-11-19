import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingPaymentEntity } from './types';

// Collection: booking_payment
@injectable()
export default class BookingPayment extends Entity<IBookingPaymentEntity> {
    constructor(props: IBookingPaymentEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props BookingPayment properties
     * @returns BookingPayment
     */
    public static create(props: IBookingPaymentEntity): BookingPayment {
        const instance = new BookingPayment(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
