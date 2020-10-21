import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from '.';
import { IBooking } from './booking';

export type IBookingInvoice = {
    invoiceNumber: NonNullable<string>;

    booking: NonNullable<IBooking>;

    amount: number;
};

/**
 * BookingInvoice entity
 */
export type IBookingInvoiceEntity = Required<IBookingInvoice> & domain.ITimstamp;

// Collection: booking_invoices
@injectable()
export default class BookingInvoice extends Entity<IBookingInvoiceEntity> {
    constructor(props: IBookingInvoiceEntity, _id?: string) {
        super(props, _id);
    }
}
