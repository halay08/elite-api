import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorHappyUserEntity } from './types';

// Collection: tutor_happy_users
@injectable()
export default class TutorHappyUser extends Entity<ITutorHappyUserEntity> {
    constructor(props: ITutorHappyUserEntity) {
        super(props);
    }
}
