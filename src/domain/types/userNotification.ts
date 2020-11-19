import { IEmbedUser, INotificationType, IEntity, ITimstamp } from '.';

type IUserNotification = {
    /**
     * If receiver is null or undefined, it will send to all users
     */
    receiver?: IEmbedUser & Required<IEntity>;

    // 0 ---> Normal 1 ---> Warning 2 ---> Urgent
    type: INotificationType;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User notification entity
 */
type IUserNotificationEntity = IEntity & IUserNotification & ITimstamp;

export { IUserNotification, IUserNotificationEntity };
