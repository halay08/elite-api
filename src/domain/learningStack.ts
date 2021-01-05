import { injectable } from 'inversify';

import { Entity } from './entity';
import { ILearningStackEntity, LearningStatus } from './types';
import { IDocumentReference } from '@/src/infra/database/types';

// Collection: learning_stacks
@injectable()
export class LearningStack extends Entity<ILearningStackEntity> {
    constructor(props: ILearningStackEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props LearningStack properties
     * @returns LearningStack
     */
    public static create(props: ILearningStackEntity): LearningStack {
        const instance = new LearningStack(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get booking(): IDocumentReference {
        return this._props.booking;
    }

    get student(): IDocumentReference {
        return this._props.student;
    }

    get tutor(): IDocumentReference {
        return this._props.tutor;
    }

    get status(): LearningStatus {
        return this._props.status;
    }

    get earnedAmount(): number {
        return this._props.earnedAmount;
    }

    get comment(): string | undefined {
        return this._props.comment;
    }

    get startTime(): Date {
        return this._props.startTime;
    }
}
