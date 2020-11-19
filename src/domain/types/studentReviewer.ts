import { IEmbedUser, IEntity, ITimstamp } from '.';

type IStudentReviewer = {
    tutor: IEmbedUser;

    student: IEmbedUser;

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
type IStudentReviewerEntity = IEntity & IStudentReviewer & ITimstamp;

export { IStudentReviewer, IStudentReviewerEntity };
