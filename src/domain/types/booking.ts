import { IDocumentReference } from '@/src/infra/database/types';
import { ITimestamp, IEntity } from '.';
import { ISession } from './session';

enum IBookingStatus {
    OPEN = 1,
    REVIEWING = 2,
    APPROVED = 3
}

enum IBookingType {
    COURSE = 'course',
    SESSION = 'session'
}

enum ILearningStatus {
    BOOKED = 'booked',
    STARTED = 'started',
    CANCELLED = 'cancelled',
    REVIEWING = 'reviewing',
    COMPLETED = 'completed'
}

type IBookingSession = Pick<ISession, 'startTime' | 'duration' | 'cost' | 'costType'>;

type IBooking = {
    // Student reference
    // The reference point to student collection
    student: IDocumentReference;

    // Origin session reference. It's origin because the session may be re-scheduled by tutor.
    // The reference point to session collection
    originSession: IDocumentReference;

    // The data use to store booked session histories.
    bookingSession: IBookingSession;

    // Status of learning, it will be used to report and history feature.
    learningStatus: ILearningStatus;

    bookingNumber: string;

    bookedAt: Date;

    // Payment reference
    payment: IDocumentReference;

    status: IBookingStatus;
};

type IBookingEntity = IEntity & IBooking & ITimestamp;

export { IBookingStatus, IBookingType, IBooking, IBookingEntity };
