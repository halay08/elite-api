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
        return this._props.upcomingMinute;
    }

    get completedMinute(): number {
        return this._props.completedMinute;
    }

    get cancelledMinute(): number {
        return this._props.cancelledMinute;
    }

    get missedMinute(): number {
        return this._props.missedMinute;
    }

    get totalEarnedAmount(): number {
        return this._props.totalEarnedAmount;
    }
}
