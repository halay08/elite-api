import { injectable } from 'inversify';

import { Entity } from './entity';
import { IStudentReviewerEntity } from './types';

// Collection: student_reviewers
@injectable()
export default class StudentReviewer extends Entity<IStudentReviewerEntity> {
    constructor(props: IStudentReviewerEntity) {
        super(props);
    }
}
