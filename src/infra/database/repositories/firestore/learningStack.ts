import { provide } from 'inversify-binding-decorators';
import { LearningStack } from '@/domain';
import { LearningStackMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ILearningStackRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ILearningStackEntity } from '@/src/domain/types';

@provide(TYPES.LearningStackRepository)
export class LearningStackRepository extends BaseRepository<LearningStack> implements ILearningStackRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.LearningStack;
    }

    /**
     * Map fields to domain entity
     * @param item Entity raw field
     * @returns domain
     */
    protected toDomain(item: LearningStack): LearningStack {
        return LearningStackMapper.toDomain(item);
    }

    /**
     * Serialize domain entity
     * @param item Entity object
     * @returns serialize
     */
    protected serialize(item: LearningStack): ILearningStackEntity {
        return item.serialize();
    }
}
