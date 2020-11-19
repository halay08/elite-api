import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingPaymentEntity } from './types';

// Collection: booking_payment
@injectable()
export default class BookingPayment extends Entity<IBookingPaymentEntity> {
    constructor(props: IBookingPaymentEntity) {
        super(props);
    }
}
