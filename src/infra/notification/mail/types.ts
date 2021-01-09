export enum Vendor {
    GMAIL,
    SENDGRID
}

export enum TemplateType {
    BOOKING_STUDENT = 'booking_student',
    BOOKING_TUTOR = 'booking_tutor',
    REMINDER = 'reminder'
}

export interface EmailNotification {
    to: string | Array<string>;
    template: TemplateType;
    data: object;
    send(): void;
}
