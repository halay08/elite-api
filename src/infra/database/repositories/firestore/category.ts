import { provide } from 'inversify-binding-decorators';
import { Category } from '@/domain';
import { CategoryMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ICategoryRepository } from '../interfaces';
import BaseRepository from './base';
import { IQueryOption } from '@/infra/database/types';
import { IFirestoreQuery } from '../../firestore/types';
import { NotFoundError } from '@/app/errors';
import { COLLECTIONS } from '../../config/collection';
import { ICategoryEntity } from '@/src/domain/types';

@provide(TYPES.CategoryRepository)
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.CATEGORY;
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
     * @param data Entity object
     * @returns serialize
     */
    protected serialize(data: Category): ICategoryEntity {
        return data.serialize();
    }

    /**
     * Querys category records
     * @template Category
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(
        queries: IFirestoreQuery<Category>[] = [],
        options: Partial<IQueryOption<Category>> = {}
    ): Promise<Category[]> {
        const docs = await this.collection.query(queries, options);
        return docs.map((item) => CategoryMapper.toDomain(item));
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(): Promise<Category[]> {
        const categories = await this.collection.findAll();
        return categories.map((item) => CategoryMapper.toDomain(item));
    }

    /**
     * Finds by id
     * @param id
     * @returns by id
     */
    async findById(id: string): Promise<Category> {
        const category = await this.collection.findById(id);
        if (!category) {
            throw new NotFoundError('Category not found');
        }

        return CategoryMapper.toDomain(category);
    }

    /**
     * Creates category record
     * @param category
     * @returns create
     */
    async create(categoryModel: Category): Promise<Category> {
        const dto = categoryModel.serialize();
        const { id } = dto;

        if (id) {
            await this.collection.set(id, dto);
            return categoryModel;
        }

        const category = await this.collection.create(dto);
        return CategoryMapper.toDomain(category);
    }

    /**
     * Updates category record
     * @param id
     * @param category
     * @returns update
     */
    async update(id: string, category: Category): Promise<Category> {
        const dto = category.serialize();
        await this.collection.update(id, dto);

        return CategoryMapper.toDomain(category);
    }

    /**
     * Deletes category record
     * @param id
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return (await this.collection.delete(id, softDelete)).writeTime.seconds;
    }
}
