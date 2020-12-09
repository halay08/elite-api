import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingInvoiceEntity } from './types';

// Collection: booking_invoices
@injectable()
export class BookingInvoice extends Entity<IBookingInvoiceEntity> {
    constructor(props: IBookingInvoiceEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props BookingInvoice properties
     * @returns BookingInvoice
     */
    public static create(props: IBookingInvoiceEntity): BookingInvoice {
        const instance = new BookingInvoice(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
