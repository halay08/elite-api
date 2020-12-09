import { provide } from 'inversify-binding-decorators';
import { Category } from '@/domain';
import { CategoryMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ICategoryRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ICategoryEntity } from '@/src/domain/types';

@provide(TYPES.CategoryRepository)
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.Category;
    }

    /**
     * Map fields to domain entity
     * @param category Entity raw field
     * @returns domain
     */
    protected toDomain(category: Category): Category {
        return CategoryMapper.toDomain(category);
    }

    /**
     * Serialize domain entity
     * @param category Entity object
     * @returns serialize
     */
    protected serialize(category: Category): ICategoryEntity {
        return category.serialize();
    }
}
