import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/infra/database/types';

type IBookingInvoice = {
    invoiceNumber: string;

    // Booking reference document
    booking: IDocumentReference;

    amount: number;
};

/**
 * Booking Invoice entity
 */
type IBookingInvoiceEntity = IEntity & IBookingInvoice & ITimestamp;

export { IBookingInvoice, IBookingInvoiceEntity };
