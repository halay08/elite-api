import { provide } from 'inversify-binding-decorators';
import { LearningData } from '@/domain';
import { LearningDataMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ILearningDataRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ILearningDataEntity } from '@/src/domain/types';

@provide(TYPES.LearningDataRepository)
export class LearningDataRepository extends BaseRepository<LearningData> implements ILearningDataRepository {
    constructor() {
        super();
        // No deletedAt field is included in the collection document
        this.collection.useHardDelete();
    }
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.LearningData;
    }

    /**
     * Map fields to domain entity
     * @param value Entity raw field
     * @returns domain
     */
    protected toDomain(value: LearningData): LearningData {
        return LearningDataMapper.toDomain(value);
    }

    /**
     * Serialize domain entity
     * @param value Entity object
     * @returns serialize
     */
    protected serialize(value: LearningData): ILearningDataEntity {
        return value.serialize();
    }
}
