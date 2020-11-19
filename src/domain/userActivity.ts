import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserActivityEntity } from './types';

// Collection user_activities
@injectable()
export default class UserActivity extends Entity<IUserActivityEntity> {
    constructor(props: IUserActivityEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props UserActivity properties
     * @returns UserActivity
     */
    public static create(props: IUserActivityEntity): UserActivity {
        const instance = new UserActivity(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
