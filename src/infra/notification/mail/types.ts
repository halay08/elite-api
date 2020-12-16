export enum Vendor {
    GMAIL,
    SENTRY
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
