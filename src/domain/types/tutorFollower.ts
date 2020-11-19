import { IEmbedUser, IEntity, ITimstamp } from '.';

type ITutorFollower = {
    tutor: IEmbedUser;

    student: IEmbedUser;
};

/**
 * Tutor follower entity
 */
type ITutorFollowerEntity = IEntity & Required<ITutorFollower> & ITimstamp;

export { ITutorFollower, ITutorFollowerEntity };
