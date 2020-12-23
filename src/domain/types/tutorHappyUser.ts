import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorHappyUser = {
    tutor: IDocumentReference;
    student: IDocumentReference;
};

/**
 * Tutor follower entity
 */
type ITutorHappyUserEntity = IEntity & ITutorHappyUser & ITimestamp;

export { ITutorHappyUser, ITutorHappyUserEntity };
