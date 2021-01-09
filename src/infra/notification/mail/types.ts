export enum Vendor {
    GMAIL,
    SENDGRID
}

export enum TemplateType {
    BOOKING_STUDENT = 'booking_student',
    BOOKING_TUTOR = 'booking_tutor',
    REMINDER_TUTOR = 'reminder_tutor',
    REMINDER_STUDENT = 'reminder_student'
}

export interface EmailNotification {
    to: string | Array<string>;
    template: TemplateType;
    data: object;
    send(): void;
}
