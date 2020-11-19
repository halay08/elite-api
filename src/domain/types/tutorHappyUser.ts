import { IEmbedUser, IEntity, ITimstamp } from '.';

type ITutorHappyUser = {
    tutor: IEmbedUser;

    student: IEmbedUser;
};

/**
 * Tutor follower entity
 */
type ITutorHappyUserEntity = IEntity & Required<IEmbedUser> & ITimstamp;

export { ITutorHappyUser, ITutorHappyUserEntity };
