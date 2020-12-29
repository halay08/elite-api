import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorReviewerSummaryEntity } from './types';
import { IDocumentReference } from '@/infra/database/types';

// Collection: tutor_reviewer_summary
@injectable()
export class TutorReviewerSummary extends Entity<ITutorReviewerSummaryEntity> {
    constructor(props: ITutorReviewerSummaryEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorReviewerSummary properties
     * @returns TutorReviewerSummary
     */
    public static create(props: ITutorReviewerSummaryEntity): TutorReviewerSummary {
        const instance = new TutorReviewerSummary(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get tutor(): IDocumentReference {
        return this._props.tutor;
    }

    get punctual(): number {
        return this._props.punctual;
    }

    get organized(): number {
        return this._props.organized;
    }

    get engaging(): number {
        return this._props.engaging;
    }

    get totalOfReviewer(): number {
        return this._props.totalOfReviewer;
    }
}
