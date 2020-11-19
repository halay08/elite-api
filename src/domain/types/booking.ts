import { IEmbedSession, IEmbedCourse, IEmbedUser, IBookingPaymentEntity, ITimstamp } from '.';
import IEntity from './entity';

enum IBookingStatus {
    OPEN = 1,
    REVIEWING = 2,
    APPROVED = 3
}

enum IBookingType {
    COURSE = 'course',
    SESSION = 'session'
}

type IEmbedBooking = Required<IEntity> &
    Pick<IBookingEntity, 'type' | 'object' | 'student' | 'bookingNumber' | 'bookedAt'>;

type IBooking = {
    type: IBookingType;

    object: IEmbedSession | IEmbedCourse;

    student: IEmbedUser;

    bookingNumber: string;

    bookedAt: Date;

    payment: Pick<IBookingPaymentEntity, 'id' | 'paymentMethod' | 'orderId' | 'transactionId'>;

    status: IBookingStatus;
};

type IBookingEntity = IEntity & IBooking & ITimstamp;

export { IBookingStatus, IBookingType, IEmbedBooking, IBooking, IBookingEntity };
