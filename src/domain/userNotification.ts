import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserNotificationEntity, INotificationType, IEmbedUser } from './types';

// Collection: user_notificationns
@injectable()
export default class UserNotification extends Entity<IUserNotificationEntity> {
    constructor(props: IUserNotificationEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props UserNotification properties
     * @returns UserNotification
     */
    public static create(props: IUserNotificationEntity): UserNotification {
        const instance = new UserNotification(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    /**
     * If receiver is null or undefined, it will send to all users
     */
    get receiver(): IEmbedUser | undefined {
        return this.props.receiver;
    }

    // 0 ---> Normal 1 ---> Warning 2 ---> Urgent
    get type(): INotificationType {
        return this.props.type;
    }

    get subject(): string {
        return this.subject;
    }

    get read(): boolean {
        return this.props.read;
    }
}
