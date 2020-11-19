import { IEmbedUser, INotificationType, IEntity, ITimstamp } from '.';

type IUserNotification = {
    /**
     * If receiver is null or undefined, it will send to all users
     */
    receiver?: IEmbedUser;

    // 0 ---> Normal 1 ---> Warning 2 ---> Urgent
    type: INotificationType;

    subject: string;

    read: boolean;
};

/**
 * User notification entity
 */
type IUserNotificationEntity = IEntity & IUserNotification & ITimstamp;

export { IUserNotification, IUserNotificationEntity };
