export interface IPaymentHandler {
    setNext(handler: IPaymentHandler): IPaymentHandler;

    handle(request: IPaymentRequestHandler<any>): Promise<any>;
}

export enum ChainOfEvents {
    BOOKING_HANDLER = 'booking_handler',
    SESSION_HANDLER = 'session_handler',
    VIDEOCALL_HANDLER = 'videocall_handler',
    LEARNINGSTACK_HANDLER = 'learningstack_handler',
    SCHEDULED_TASK_HANDLER = 'scheduled_task_handler',
    NOTIFICATION_TASK_HANDLER = 'notification_task_handler'
}

export interface IPaymentRequestHandler<T> {
    name: ChainOfEvents;
    data: T | Partial<T>;
    id: string;
}
