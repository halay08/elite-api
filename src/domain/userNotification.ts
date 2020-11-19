import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserNotificationEntity } from './types';

// Collection: user_notificationns
@injectable()
export default class UserNotification extends Entity<IUserNotificationEntity> {
    constructor(props: IUserNotificationEntity) {
        super(props);
    }
}
