import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser } from '.';

export type IUserNotification = {
    /**
     * If receiver is null or undefined, it will send to all users
     */
    receiver?: IEmbedUser & domain.IObjectId;

    // 0 ---> Normal 1 ---> Warning 2 ---> Urgent
    type: domain.NotificationType;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User notification entity
 */
export type IUserNotificationEntity = domain.IEntity & IUserNotification & domain.ITimstamp;

// Collection: user_notificationns
@injectable()
export default class UserNotification extends Entity<IUserNotificationEntity> {
    constructor(props: IUserNotificationEntity, _id?: string) {
        super(props, _id);
    }
}
