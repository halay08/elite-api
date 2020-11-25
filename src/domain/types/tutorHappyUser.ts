import { IEmbedUser, IEntity, ITimestamp } from '.';

type ITutorHappyUser = {
    tutor: IEmbedUser;

    student: IEmbedUser;
};

/**
 * Tutor follower entity
 */
type ITutorHappyUserEntity = IEntity & Required<IEmbedUser> & ITimestamp;

export { ITutorHappyUser, ITutorHappyUserEntity };
