import { IDocumentReference } from '@/src/infra/database/types';
import { ITimestamp, IEntity } from '.';

enum IBookingStatus {
    OPEN = 1,
    REVIEWING = 2,
    APPROVED = 3
}

enum IBookingType {
    COURSE = 'course',
    SESSION = 'session'
}

type IBooking = {
    type: IBookingType;

    // Course or session reference
    object: IDocumentReference;

    // User reference
    student: IDocumentReference;

    bookingNumber: string;

    bookedAt: Date;

    // Payment reference
    payment: IDocumentReference;

    status: IBookingStatus;
};

type IBookingEntity = IEntity & IBooking & ITimestamp;

export { IBookingStatus, IBookingType, IBooking, IBookingEntity };
