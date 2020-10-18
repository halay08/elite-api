import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser } from '.';

export type IUserInbox = {
    sender: IEmbedUser;

    receiver: IEmbedUser;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User inbox entity
 */
export type IUserInboxEntity = domain.IEntity & Required<IUserInbox> & domain.ITimstamp;

// Collection: user_inbox
@injectable()
export default class UserInbox extends Entity<IUserInboxEntity> {
    constructor(props: IUserInboxEntity, _id?: string) {
        super(props, _id);
    }
}
