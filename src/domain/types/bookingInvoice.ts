import { IEntity, IEmbedBooking, ITimstamp } from '.';

type IBookingInvoice = {
    invoiceNumber: string;

    booking: IEmbedBooking;

    amount: number;
};

/**
 * Booking Invoice entity
 */
type IBookingInvoiceEntity = IEntity & IBookingInvoice & ITimstamp;

export { IBookingInvoice, IBookingInvoiceEntity };
