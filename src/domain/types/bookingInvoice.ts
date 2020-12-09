import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity, ITimestamp } from '.';

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
