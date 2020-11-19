import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { UserMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import IUserRepository from '../userRepositoryInterface';
import BaseRepository from './baseRepository';
import { IQueryOption } from '@/infra/database/types';
import { IFirestoreQuery } from '../../firestore/types';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { NotFoundError } from '@/app/errors/notFound';

@provide(TYPES.UserRepository)
export default class UserRepository extends BaseRepository<User> implements IUserRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return 'users';
    }

    /**
     * Querys user repository
     * @template User
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IFirestoreQuery<User>[] = [], options: Partial<IQueryOption<User>> = {}): Promise<User[]> {
        const docs = await this.collection.query(queries, options);
        return docs.map((item) => UserMapper.toDomain(item));
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
        const user = await this.collection.findById(id);
        if (!user) {
            throw new NotFoundError('User is not found');
        }

        return UserMapper.toDomain(user);
    }

    /**
     * Creates user repository
     * @param user
     * @returns create
     */
    async create(userModel: User): Promise<User> {
        try {
            const dto = userModel.serialize();
            const { id } = dto;

            if (id) {
                await this.collection.set(id, dto);
                return userModel;
            }

            const user = await this.collection.create(dto);
            return UserMapper.toDomain(user);
        } catch (error) {
            throw new HttpsError('invalid-argument', error);
        }
    }

    /**
     * Updates user repository
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, user: User): Promise<User> {
        const dto = user.serialize();
        await this.collection.update(id, dto);

        return UserMapper.toDomain(user);
    }

    /**
     * Deletes user repository
     * @param id
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return (await this.collection.delete(id, softDelete)).writeTime.seconds;
    }
}
