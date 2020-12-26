import { provide } from 'inversify-binding-decorators';
import { TutorReviewerSummary } from '@/domain';
import { TutorReviewerSummaryMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ITutorReviewerSummaryRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ITutorReviewerSummaryEntity } from '@/src/domain/types';

@provide(TYPES.TutorReviewerSummaryRepository)
export class TutorReviewerSummaryRepository
    extends BaseRepository<TutorReviewerSummary>
    implements ITutorReviewerSummaryRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.TutorReviewerSummary;
    }

    /**
     * Map fields to domain entity
     * @param item Entity raw field
     * @returns domain
     */
    protected toDomain(item: TutorReviewerSummary): TutorReviewerSummary {
        return TutorReviewerSummaryMapper.toDomain(item);
    }

    /**
     * Serialize domain entity
     * @param item Entity object
     * @returns serialize
     */
    protected serialize(item: TutorReviewerSummary): ITutorReviewerSummaryEntity {
        return item.serialize();
    }
}
