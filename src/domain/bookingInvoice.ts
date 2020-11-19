import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingInvoiceEntity } from './types';

// Collection: booking_invoices
@injectable()
export default class BookingInvoice extends Entity<IBookingInvoiceEntity> {
    constructor(props: IBookingInvoiceEntity) {
        super(props);
    }
}
