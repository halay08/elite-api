import { IEmbedUser, INotificationType, IEntity, ITimestamp } from '.';

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
type IUserNotificationEntity = IEntity & IUserNotification & ITimestamp;

export { IUserNotification, IUserNotificationEntity };
