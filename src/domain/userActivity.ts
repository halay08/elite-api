import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserActivityEntity } from './types';

// Collection user_activities
@injectable()
export default class UserActivity extends Entity<IUserActivityEntity> {
    constructor(props: IUserActivityEntity) {
        super(props);
    }
}
