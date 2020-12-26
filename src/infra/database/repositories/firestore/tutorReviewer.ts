import { provide } from 'inversify-binding-decorators';
import { TutorReviewer } from '@/domain';
import { TutorReviewerMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ITutorReviewerRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ITutorReviewerEntity } from '@/src/domain/types';

@provide(TYPES.TutorReviewerRepository)
export class TutorReviewerRepository extends BaseRepository<TutorReviewer> implements ITutorReviewerRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.TutorReviewer;
    }

    /**
     * Map fields to domain entity
     * @param item Entity raw field
     * @returns domain
     */
    protected toDomain(item: TutorReviewer): TutorReviewer {
        return TutorReviewerMapper.toDomain(item);
    }

    /**
     * Serialize domain entity
     * @param item Entity object
     * @returns serialize
     */
    protected serialize(item: TutorReviewer): ITutorReviewerEntity {
        return item.serialize();
    }
}
