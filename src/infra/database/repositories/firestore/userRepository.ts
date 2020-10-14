import { provide } from 'inversify-binding-decorators';

import { User } from '@/domain/user';
import { UserMapper } from '@/infra/database/mappers/user';
import TYPES from '@/src/types';

import IUserRepository from '../userRepositoryInterface';
import BaseRepository from './baseRepository';

@provide(TYPES.UserRepository)
export default class UserRepository extends BaseRepository implements IUserRepository {
    async findAll(): Promise<User[]> {
        const users = await this.database.users.findAll();
        return users.map((item) => UserMapper.toDomain(item));
    }

    async findById(id: string): Promise<User> {
        const item = await this.database.users.findById(id);
        if (!item) {
            throw new Error(`User ${id} not found`);
        }
        return UserMapper.toDomain(item);
    }

    async create(user: User): Promise<string> {
        const inserted = await this.database.users.create(user);
        return inserted;
    }

    async update(id: string, user: User): Promise<string> {
        return await this.database.users.update(id, user);
    }

    async delete(id: string): Promise<string> {
        return await this.database.users.delete(id);
    }
}
