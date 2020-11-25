import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserInboxEntity, IEmbedUser } from './types';

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

    /**
     * User who sends the inbox message
     */
    get sender(): IEmbedUser | undefined {
        return this.props.sender;
    }

    /**
     * User who receives the inbox message
     */
    get receiver(): IEmbedUser | undefined {
        return this.props.receiver;
    }
}
