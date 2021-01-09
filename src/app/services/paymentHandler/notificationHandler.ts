import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';
import { env } from '@/app/functions/configs/runtime';

export class NotificationHandler extends AbstractHandler<any> {
    public handle({ name, data, id }: IPaymentRequestHandler<any>): Promise<any> {
        if (name === ChainOfEvents.NOTIFICATION_TASK_HANDLER) {
            const { student, tutor, orderData } = data;
            const baseURL = process.env.FRONTEND_URL || env.frontend.url;
            const domain = process.env.DOMAIN || env.frontend.domain;
            const hotLine = process.env.HOT_LINE || env.frontend.hot_line;

            const studentNotification = new EmailAdapter(
                student.email,
                TemplateType.BOOKING_STUDENT,
                {
                    ...orderData,
                    domain,
                    orderURL: `${baseURL}/orders`,
                    calendarURL: `${baseURL}/calendar`,
                    name: student.name,
                    tutorName: tutor.name,
                    hotLine
                },
                Vendor.GMAIL
            );

            const tutorNotification = new EmailAdapter(
                tutor.email,
                TemplateType.BOOKING_TUTOR,
                {
                    ...orderData,
                    domain,
                    bookingURL: `${baseURL}/booking`,
                    calendarURL: `${baseURL}/calendar`,
                    name: tutor.name,
                    studentName: student.name,
                    hotLine
                },
                Vendor.GMAIL
            );

            return Promise.all([studentNotification.send(), tutorNotification.send()]).catch(({ message }) => {
                throw new Error(message);
            });
        }

        return super.handle({ name, data, id });
    }
}
