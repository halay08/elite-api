import Container from '@/src/container';
import TYPES from '@/src/types';
import { ScheduledTask } from '@/domain';
import { ScheduledTaskService } from '@/app/services';
import { EmailReminderStrategy } from './reminderStrategy';
import { IScheduledTaskEntity, ScheduledTaskStatus, ScheduledTaskMethod } from '@/domain/types';
import { TemplateType } from '@/src/infra/notification/mail';
import { MINUTES_BEFOREHAND } from './constants';
import { BaseReminder } from './base';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class StudentReminder extends BaseReminder implements EmailReminderStrategy {
    protected getEmailTemplate(): string {
        return TemplateType.REMINDER_STUDENT;
    }

    public scheduleToSendEmail(): Promise<ScheduledTask[]> {
        const scheduledTaskService = Container.get<ScheduledTaskService>(TYPES.ScheduledTaskService);

        const userTimezone = this.user.timezone;

        const getBookingDate = dayjs(this.bookingData.bookedDate).tz(userTimezone).format('YYYY-MM-DD');

        const getStartTime = dayjs(this.performAt).tz(userTimezone).format('HH:mm');

        const meetingTime = dayjs(`${getBookingDate} ${getStartTime}`);

        const sendMessages = MINUTES_BEFOREHAND.map((min) => {
            const beforeFifteenMinutes = meetingTime.subtract(min, 'minute');

            const userEntity: IScheduledTaskEntity = {
                status: ScheduledTaskStatus.SCHEDULED,
                method: ScheduledTaskMethod.EMAIL,
                performAt: beforeFifteenMinutes.toDate(),
                options: {
                    email: this.user.email,
                    data: { ...this.bookingData, startTime: meetingTime.format('YYYY-MM-DD HH:mm') },
                    template: this.getEmailTemplate()
                }
            };

            return scheduledTaskService.create(ScheduledTask.create(userEntity));
        });

        return Promise.all(sendMessages).catch(({ message }) => {
            throw new Error(message);
        });
    }
}
