import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserInboxEntity } from './types';

// Collection: user_inbox
@injectable()
export default class UserInbox extends Entity<IUserInboxEntity> {
    constructor(props: IUserInboxEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props UserInbox properties
     * @returns UserInbox
     */
    public static create(props: IUserInboxEntity): UserInbox {
        const instance = new UserInbox(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
