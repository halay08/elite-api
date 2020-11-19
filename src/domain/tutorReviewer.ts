import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorReviewerEntity } from './types';

// Collection: tutor_reviewers
@injectable()
export default class TutorReviewer extends Entity<ITutorReviewerEntity> {
    constructor(props: ITutorReviewerEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorReviewer properties
     * @returns TutorReviewer
     */
    public static create(props: ITutorReviewerEntity): TutorReviewer {
        const instance = new TutorReviewer(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}