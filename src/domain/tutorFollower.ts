import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorFollowerEntity } from './types';

// Collection: tutor_followers
@injectable()
export default class TutorFollower extends Entity<ITutorFollowerEntity> {
    constructor(props: ITutorFollowerEntity) {
        super(props);
    }
}
