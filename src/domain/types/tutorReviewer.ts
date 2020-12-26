import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorReviewer = {
    tutor: IDocumentReference;

    student: IDocumentReference;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    punctual: number;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    organized: number;

    /**
     * Review by 5 stars ✭✭✭✭✭
     */
    engaging: number;

    comment: string;
};

/**
 * StudentReviewer entity
 */
type ITutorReviewerEntity = IEntity & ITutorReviewer & ITimestamp;

export { ITutorReviewer, ITutorReviewerEntity };
