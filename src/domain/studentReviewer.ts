import { injectable } from 'inversify';

import { Entity } from './entity';
import { IStudentReviewerEntity } from './types';

// Collection: student_reviewers
@injectable()
export default class StudentReviewer extends Entity<IStudentReviewerEntity> {
    constructor(props: IStudentReviewerEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props StudentReviewer properties
     * @returns StudentReviewer
     */
    public static create(props: IStudentReviewerEntity): StudentReviewer {
        const instance = new StudentReviewer(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
