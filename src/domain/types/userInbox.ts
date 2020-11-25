import { IEmbedUser, IEntity, ITimestamp } from '.';

type IUserInbox = {
    sender: IEmbedUser;

    receiver: IEmbedUser;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User inbox entity
 */
type IUserInboxEntity = IEntity & IUserInbox & ITimestamp;

export { IUserInbox, IUserInboxEntity };
