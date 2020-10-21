import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';
import { IEmbedUser } from './user';

export type ITutorReviewer = {
    tutor: NonNullable<IEmbedUser>;

    student: NonNullable<IEmbedUser>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    punctual: NonNullable<number>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    organized: NonNullable<number>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    engaging: NonNullable<number>;

    comment: string;
};

/**
 * StudentReviewer entity
 */
export type ITutorReviewerEntity = ITutorReviewer & domain.ITimstamp;

@injectable()
export default class TutorReviewer extends Entity<ITutorReviewerEntity> {
    constructor(props: ITutorReviewerEntity, _id?: string) {
        super(props, _id);
    }
}
