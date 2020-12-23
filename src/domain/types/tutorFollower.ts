import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorFollower = {
    tutor: IDocumentReference;
    student: IDocumentReference;
};

/**
 * Tutor follower entity
 */
type ITutorFollowerEntity = IEntity & Required<ITutorFollower> & ITimestamp;

export { ITutorFollower, ITutorFollowerEntity };
