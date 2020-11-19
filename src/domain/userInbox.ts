import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserInboxEntity } from './types';

// Collection: user_inbox
@injectable()
export default class UserInbox extends Entity<IUserInboxEntity> {
    constructor(props: IUserInboxEntity) {
        super(props);
    }
}
