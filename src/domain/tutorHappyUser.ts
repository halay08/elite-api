import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser } from '.';

export type ITutorHappyUser = {
    tutor: NonNullable<IEmbedUser>;

    student: NonNullable<IEmbedUser>;
};

/**
 * Tutor follower entity
 */
export type ITutorHappyUserEntity = domain.IEntity & Required<IEmbedUser> & domain.ITimstamp;

// Collection: tutor_happy_users
@injectable()
export default class TutorHappyUser extends Entity<ITutorHappyUserEntity> {
    constructor(props: ITutorHappyUserEntity, _id?: string) {
        super(props, _id);
    }
}
