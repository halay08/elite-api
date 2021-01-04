import { IUserEntity } from '@/domain/types';
import { EmailBookingDataTypes } from '../';

export type ScheduledTaskData = {
    user: IUserEntity;
    performAt: Date;
    bookingData: EmailBookingDataTypes;
};

export interface EmailReminderStrategy {
    sendEmail(): Promise<any>;
}
