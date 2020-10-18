import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser } from '.';

export type ITutorFollower = {
    tutor: NonNullable<IEmbedUser>;

    student: NonNullable<IEmbedUser>;
};

/**
 * Tutor follower entity
 */
export type ITutorFollowerEntity = Required<ITutorFollower> & domain.ITimstamp;

// Collection: tutor_followers
@injectable()
export default class TutorFollower extends Entity<ITutorFollowerEntity> {
    constructor(props: ITutorFollowerEntity, _id?: string) {
        super(props, _id);
    }
}
