import { IEntity, IEmbedBooking, ITimestamp } from '.';

type IBookingInvoice = {
    invoiceNumber: string;

    booking: IEmbedBooking;

    amount: number;
};

/**
 * Booking Invoice entity
 */
type IBookingInvoiceEntity = IEntity & IBookingInvoice & ITimestamp;

export { IBookingInvoice, IBookingInvoiceEntity };
