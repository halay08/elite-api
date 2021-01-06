import { IDocumentReference } from '@/src/infra/database/types';
import { ITeachingSummary } from '.';
import { IEntity } from './entity';

/**
 * Student learning data entity
 */
type ILearningDataEntity = IEntity &
    Required<ITeachingSummary> & {
        student: IDocumentReference;

        // Tutor did not join the class room
        missedTutorMinute?: number;
    };

export { ILearningDataEntity };
