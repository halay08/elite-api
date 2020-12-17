import { Vendor, EmailNotification, TemplateType } from './types';
import { Gmail } from './gmail';

export class EmailAdapter implements EmailNotification {
    to: string;
    template: TemplateType;
    data: object;
    type: Vendor;

    constructor(to: string, template: TemplateType, data: object, type: Vendor) {
        this.to = to;
        this.template = template;
        this.data = data;
        this.type = type;
    }

    public send() {
        try {
            switch (this.type) {
                case Vendor.GMAIL:
                    const gmail = new Gmail(this.to, this.template, this.data);
                    gmail.send();
                    break;
                case Vendor.SENDGRID:
                    // TBD
                    break;
                default:
                    break;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}
