import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorFollowerEntity } from './types';

// Collection: tutor_followers
@injectable()
export class TutorFollower extends Entity<ITutorFollowerEntity> {
    constructor(props: ITutorFollowerEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorFollower properties
     * @returns TutorFollower
     */
    public static create(props: ITutorFollowerEntity): TutorFollower {
        const instance = new TutorFollower(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
