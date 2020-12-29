import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity } from '.';

type ITeachingData = {
    tutor: IDocumentReference;

    completedMinute?: number;

    upcomingMinute?: number;

    cancelledMinute?: number;

    missedMinute?: number;

    totalEarnedAmount?: number;
};

/**
 * Tutor teaching data entity
 */
type ITeachingDataEntity = IEntity & Required<ITeachingData>;

export { ITeachingDataEntity, ITeachingData };
