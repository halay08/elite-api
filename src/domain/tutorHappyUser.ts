import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorHappyUserEntity } from './types';

// Collection: tutor_happy_users
@injectable()
export class TutorHappyUser extends Entity<ITutorHappyUserEntity> {
    constructor(props: ITutorHappyUserEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorHappyUser properties
     * @returns TutorHappyUser
     */
    public static create(props: ITutorHappyUserEntity): TutorHappyUser {
        const instance = new TutorHappyUser(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
