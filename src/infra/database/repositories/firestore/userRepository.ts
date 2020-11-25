import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { UserMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IUserRepository } from '../userRepositoryInterface';
import BaseRepository from './baseRepository';
import { COLLECTIONS } from '../../config/collection';
import { IUserEntity } from '@/src/domain/types';

@provide(TYPES.UserRepository)
export default class UserRepository extends BaseRepository<User> implements IUserRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.USER;
    }

    /**
     * Map fields to domain entity
     * @param user Entity raw field
     * @returns domain
     */
    protected toDomain(user: User): User {
        return UserMapper.toDomain(user);
    }

    /**
     * Serialize domain entity
     * @param data Entity object
     * @returns serialize
     */
    protected serialize(data: User): IUserEntity {
        return data.serialize();
    }
}
