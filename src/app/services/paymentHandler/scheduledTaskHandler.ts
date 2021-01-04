import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { ScheduledTask } from '@/domain';
import { StudentReminder, TutorReminder, ReminderContext } from './scheduledTask';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class ScheduledTaskHandler extends AbstractHandler<ScheduledTask> {
    public handle({ name, data, id }: IPaymentRequestHandler<ScheduledTask>): Promise<any> {
        if (name === ChainOfEvents.SCHEDULED_TASK_HANDLER) {
            const { performAt: rawPerformAt, options } = data as any;
            const { tutor, bookingData, student } = options;
            const performAt = rawPerformAt.toDate();

            const studentReminder = new StudentReminder({ user: student, performAt, bookingData });
            const tutorReminder = new TutorReminder({ user: tutor, performAt, bookingData });
            return ReminderContext.executeEmailStrategy([studentReminder, tutorReminder]);
        }

        return super.handle({ name, data, id });
    }
}
