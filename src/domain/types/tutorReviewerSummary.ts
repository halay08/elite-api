import { IEntity } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorReviewerSummary = {
    tutor: IDocumentReference;

    /**
     * avg. of punctual by 5 stars ✭✭✭✭✭
     */
    punctual: number;

    /**
     * avg. of organized by 5 stars ✭✭✭✭✭
     */
    organized: number;

    /**
     * avg. of engaging by 5 stars ✭✭✭✭✭
     */
    engaging: number;

    totalOfReviewer: number;
};

/**
 * ITutorReviewerSummary entity
 */
type ITutorReviewerSummaryEntity = IEntity & ITutorReviewerSummary;

export { ITutorReviewerSummary, ITutorReviewerSummaryEntity };
