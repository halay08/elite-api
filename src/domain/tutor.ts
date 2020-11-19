import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorEntity } from './types';

// Collection: tutors
@injectable()
export default class Tutor extends Entity<ITutorEntity> {
    constructor(props: ITutorEntity) {
        super(props);
    }
}
