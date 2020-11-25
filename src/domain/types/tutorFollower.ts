import { IEmbedUser, IEntity, ITimestamp } from '.';

type ITutorFollower = {
    tutor: IEmbedUser;

    student: IEmbedUser;
};

/**
 * Tutor follower entity
 */
type ITutorFollowerEntity = IEntity & Required<ITutorFollower> & ITimestamp;

export { ITutorFollower, ITutorFollowerEntity };
