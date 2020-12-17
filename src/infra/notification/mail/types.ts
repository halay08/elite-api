export enum Vendor {
    GMAIL,
    SENDGRID
}

export enum TemplateType {
    BOOKING = 'booking'
}

export interface EmailNotification {
    to: string | Array<string>;
    template: TemplateType;
    data: object;
    send(): void;
}
