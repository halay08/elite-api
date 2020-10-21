import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';
import { IEmbedUser } from './user';

export type IStudentReviewer = {
    tutor: NonNullable<IEmbedUser>;

    student: NonNullable<IEmbedUser>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    punctual: NonNullable<number>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    characteristic: NonNullable<number>;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    connection: NonNullable<number>;

    comment: string;
};

/**
 * StudentReviewer entity
 */
export type IStudentReviewerEntity = IStudentReviewer & domain.ITimstamp;

// Collection: student_reviewers
@injectable()
export default class StudentReviewer extends Entity<IStudentReviewerEntity> {
    constructor(props: IStudentReviewerEntity, _id?: string) {
        super(props, _id);
    }
}
