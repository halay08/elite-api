import { IEmbedUser, IEntity, ITimstamp } from '.';

type IUserInbox = {
    sender: IEmbedUser;

    receiver: IEmbedUser;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User inbox entity
 */
type IUserInboxEntity = IEntity & IUserInbox & ITimstamp;

export { IUserInbox, IUserInboxEntity };
