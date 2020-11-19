import { IEmbedUser, IEntity, ITimstamp } from '.';

type ITutorReviewer = {
    tutor: IEmbedUser;

    student: IEmbedUser;

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
type ITutorReviewerEntity = IEntity & ITutorReviewer & ITimstamp;

export { ITutorReviewer, ITutorReviewerEntity };