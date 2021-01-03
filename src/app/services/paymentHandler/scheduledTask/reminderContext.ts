import { EmailReminderStrategy } from './reminderStrategy';

class Context {
    executeEmailStrategy(reminders: EmailReminderStrategy[]): Promise<any[]> {
        return Promise.all(reminders.map((reminder) => reminder.sendEmail()));
    }
}

export const ReminderContext = new Context();
