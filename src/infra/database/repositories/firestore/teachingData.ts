import { provide } from 'inversify-binding-decorators';
import { TeachingData } from '@/domain';
import { TeachingDataMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ITeachingDataRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ITeachingDataEntity } from '@/src/domain/types';

@provide(TYPES.TeachingDataRepository)
export class TeachingDataRepository extends BaseRepository<TeachingData> implements ITeachingDataRepository {
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
        return COLLECTIONS.TeachingData;
    }

    /**
     * Map fields to domain entity
     * @param value Entity raw field
     * @returns domain
     */
    protected toDomain(value: TeachingData): TeachingData {
        return TeachingDataMapper.toDomain(value);
    }

    /**
     * Serialize domain entity
     * @param value Entity object
     * @returns serialize
     */
    protected serialize(value: TeachingData): ITeachingDataEntity {
        return value.serialize();
    }
}
