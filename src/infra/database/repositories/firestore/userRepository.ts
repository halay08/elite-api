import { provide } from 'inversify-binding-decorators';

import User from '@/domain/user';
import { UserMapper } from '@/infra/database/mappers/user';
import TYPES from '@/src/types';

import IUserRepository from '../userRepositoryInterface';
import BaseRepository from './baseRepository';
import { Query, QueryOption } from '@/src/infra/database/firestore/collection';

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
    async create(user: User, _id?: string): Promise<string> {
        if (!_id) {
            return await this.collection.create(user);
        }
        return await this.collection.set(_id, user);
    }

    /**
     * Updates user repository
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, user: User): Promise<number> {
        return await (await this.collection.update(id, user)).writeTime.seconds;
    }

    /**
     * Deletes user repository
     * @param id
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return (await this.collection.delete(id, softDelete)).writeTime.seconds;
    }

    /**
     * Querys user repository
     * @template User
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: Query<User>[] = [], options: Partial<QueryOption<User>> = {}): Promise<User[]> {
        const docs = await this.collection.query(queries, options);

        return docs.map((item) => UserMapper.toDomain(item));
    }
}
