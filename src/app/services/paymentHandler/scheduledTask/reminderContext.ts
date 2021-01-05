import { EmailReminderStrategy } from './reminderStrategy';

class Context {
    executeEmailStrategy(reminders: EmailReminderStrategy[]): Promise<any[]> {
        return Promise.all(reminders.map((reminder) => reminder.scheduleToSendEmail()));
    }
}

export const ReminderContext = new Context();
