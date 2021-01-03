import { IEntity, ITimestamp } from '.';

enum ScheduledTaskMethod {
    EMAIL = 'email',
    SMS = 'sms',
    FCM = 'messaging'
}

enum ScheduledTaskStatus {
    SCHEDULED = 'scheduled',
    COMPLETE = 'complete',
    ERROR = 'error'
}

type ScheduledTaskFCMOptions = {};
type ScheduledTaskSMSOptions = {};
type ScheduledTaskEmailOptions = {
    email: string | string[];
    data: Object;
    template: string;
};

type IScheduledTask = {
    performAt: Date;
    status: ScheduledTaskStatus;
    method: ScheduledTaskMethod;
    options: ScheduledTaskEmailOptions | ScheduledTaskSMSOptions | ScheduledTaskFCMOptions;
};

type IScheduledTaskEntity = IEntity & IScheduledTask & ITimestamp;

export {
    IScheduledTask,
    IScheduledTaskEntity,
    ScheduledTaskMethod,
    ScheduledTaskStatus,
    ScheduledTaskEmailOptions,
    ScheduledTaskSMSOptions,
    ScheduledTaskFCMOptions
};
