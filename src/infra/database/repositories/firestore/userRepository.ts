import { provide } from 'inversify-binding-decorators';

import User from '@/domain/user';
import { UserMapper } from '@/infra/database/mappers/user';
import TYPES from '@/src/types';

import IUserRepository from '../userRepositoryInterface';
import BaseRepository from './baseRepository';

@provide(TYPES.UserRepository)
export default class UserRepository extends BaseRepository<User> implements IUserRepository {
    /**
     * Gets collection
     * @returns
     */
    protected getCollection() {
        return 'users';
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(): Promise<User[]> {
        const users = await this.collection.findAll();
        return users.map((item) => UserMapper.toDomain(item));
    }

    /**
     * Finds by id
     * @param id
     * @returns by id
     */
    async findById(id: string): Promise<User> {
        const item = await this.collection.findById(id);
        if (!item) {
            throw new Error(`User ${id} not found`);
        }
        return UserMapper.toDomain(item);
    }

    /**
     * Creates user repository
     * @param user
     * @returns create
     */
    async create(user: User): Promise<string> {
        const inserted = await this.collection.create(user);
        return inserted;
    }

    /**
     * Updates user repository
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, user: User): Promise<string> {
        return await this.collection.update(id, user);
    }

    /**
     * Deletes user repository
     * @param id
     * @returns delete
     */
    async delete(id: string): Promise<string> {
        return await this.collection.delete(id);
    }
}
