import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorReviewerEntity } from './types';

// Collection: tutor_reviewers
@injectable()
export default class TutorReviewer extends Entity<ITutorReviewerEntity> {
    constructor(props: ITutorReviewerEntity) {
        super(props);
    }
}
