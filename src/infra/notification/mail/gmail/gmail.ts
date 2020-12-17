import { EmailNotification, TemplateType } from '@/src/infra/notification/mail/types';
import { mailer } from './config';
import * as path from 'path';

export class Gmail implements EmailNotification {
    to: string;
    template: TemplateType;
    data: any;

    constructor(to: string, template: TemplateType, data?: object) {
        this.to = to;
        this.template = template;
        this.data = data;
    }

    public send() {
        mailer
            .send({
                template: path.join(__dirname, 'templates', this.template),
                message: {
                    to: this.to
                },
                locals: this.data
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }
}
