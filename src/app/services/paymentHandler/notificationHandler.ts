import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';

export class NotificationHandler extends AbstractHandler<any> {
    public handle({ name, data, id }: IPaymentRequestHandler<any>): Promise<any> {
        if (name === ChainOfEvents.NOTIFICATION_TASK_HANDLER) {
            const { email, data: emailData } = data;
            const notification = new EmailAdapter(email, TemplateType.BOOKING, emailData, Vendor.GMAIL);
            return notification.send() as any;
        }

        return super.handle({ name, data, id });
    }
}
