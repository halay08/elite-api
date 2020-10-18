import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedTutorSession, IEmbedUser, IBookingPaymentEntity } from '.';

export enum BookingStatus {
    OPEN = 1,
    REVIEWING = 2,
    APPROVED = 3
}

export type IEmbedBooking = domain.IEntity & {
    student: NonNullable<IEmbedUser>;

    bookingNumber: string;

    /**
     * Because a session has multi-repeat,
     * so when student book a session, we have let DB now what date he booked
     */
    sessionStartTime: NonNullable<Date>;

    booked_at: Date;
};

export type IBooking = Required<IEmbedBooking> & {
    session: IEmbedTutorSession;

    payment: Pick<IBookingPaymentEntity, '_id' | 'paymentMethod'>;

    status: BookingStatus;
};

/**
 * Booking entity
 */
export type IBookingEntity = IBooking;

// Collection: booking
@injectable()
export default class Booking extends Entity<IBookingEntity> {
    constructor(props: IBookingEntity, _id?: string) {
        super(props, _id);
    }
}
