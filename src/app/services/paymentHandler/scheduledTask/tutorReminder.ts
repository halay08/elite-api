import { StudentReminder } from './studentReminder';
import { TemplateType } from '@/src/infra/notification/mail';

export class TutorReminder extends StudentReminder {
    protected getEmailTemplate(): string {
        return TemplateType.REMINDER_TUTOR;
    }
}
