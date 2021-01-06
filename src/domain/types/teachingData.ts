import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity } from './entity';

type ITeachingSummary = {
    // Minutes
    completedMinute?: number;

    upcomingMinute?: number;

    cancelledMinute?: number;

    missedMinute?: number;

    // Total session
    completedSession?: number;

    missedSession?: number;

    upcomingSession?: number;

    cancelledSession?: number;
};

/**
 * Tutor teaching data entity
 */
type ITeachingDataEntity = IEntity &
    Required<ITeachingSummary> & {
        tutor: IDocumentReference;

        missedStudentMinute?: number;

        totalEarnedAmount?: number;
    };

export { ITeachingDataEntity, ITeachingSummary };
