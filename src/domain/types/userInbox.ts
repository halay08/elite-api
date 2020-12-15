import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type IUserInbox = {
    sender: IDocumentReference;

    receiver: IDocumentReference;

    subject: string;

    read: NonNullable<boolean>;
};

/**
 * User inbox entity
 */
type IUserInboxEntity = IEntity & IUserInbox & ITimestamp;

export { IUserInbox, IUserInboxEntity };
