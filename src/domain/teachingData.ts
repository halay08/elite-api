import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITeachingDataEntity } from './types';
import { IDocumentReference } from '@/infra/database/types';

// Collection: teaching_data
@injectable()
export class TeachingData extends Entity<ITeachingDataEntity> {
    constructor(props: ITeachingDataEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props ITeachingDataEntity properties
     * @returns ITeachingDataEntity
     */
    public static create(props: ITeachingDataEntity): TeachingData {
        const instance = new TeachingData(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get tutor(): IDocumentReference {
        return this._props.tutor;
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

    get missedStudentMinute(): number {
        return this._props.missedStudentMinute || 0;
    }

    get totalEarnedAmount(): number {
        return this._props.totalEarnedAmount || 0;
    }
}
