import { injectable } from 'inversify';

import { Entity } from './entity';
import { ILearningDataEntity } from './types';
import { IDocumentReference } from '@/infra/database/types';

// Collection: learning_data
@injectable()
export class LearningData extends Entity<ILearningDataEntity> {
    constructor(props: ILearningDataEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props ILearningDataEntity properties
     * @returns ILearningDataEntity
     */
    public static create(props: ILearningDataEntity): LearningData {
        const instance = new LearningData(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get student(): IDocumentReference {
        return this._props.student;
    }

    get upcomingMinute(): number {
        return this._props.upcomingMinute || 0;
    }

    get completedMinute(): number {
        return this._props.completedMinute || 0;
    }

    get cancelledMinute(): number {
        return this._props.cancelledMinute || 0;
    }

    get missedMinute(): number {
        return this._props.missedMinute || 0;
    }

    get upcomingSession(): number {
        return this._props.upcomingSession || 0;
    }

    get completedSession(): number {
        return this._props.completedSession || 0;
    }

    get cancelledSession(): number {
        return this._props.cancelledSession || 0;
    }

    get missedSession(): number {
        return this._props.missedSession || 0;
    }

    get missedTutorMinute(): number {
        return this._props.missedTutorMinute || 0;
    }
}
