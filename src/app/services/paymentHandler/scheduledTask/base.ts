import { ScheduledTaskData } from './reminderStrategy';
import { EmailBookingDataTypes } from '../';
import { IUserEntity } from '@/domain/types';

export abstract class BaseReminder {
    protected user: IUserEntity;
    protected bookingData: EmailBookingDataTypes;
    protected performAt: Date;

    /**
     * Creates an instance of base service.
     */
    constructor({ user, performAt, bookingData }: ScheduledTaskData) {
        this.user = user;
        this.performAt = performAt;
        this.bookingData = bookingData;
    }

    protected abstract getEmailTemplate(): string;
}
