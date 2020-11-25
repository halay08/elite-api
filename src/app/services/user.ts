//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import User from '@/domain/user';
import { IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { IQuery, IQueryOption } from '@/src/infra/database/types';
import { ErrorCode, HttpsError } from '@/app/errors';

@provide(TYPES.UserService)
export class UserService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly _userRepository: IUserRepository
    ) {}

    /**
     * Gets all
     * @returns all
     */
    async getAll(): Promise<User[]> {
        return await this._userRepository.findAll();
    }

    /**
     * Querys user service
     * @template User
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IQuery<User>[] = [], options: Partial<IQueryOption<User>> = {}): Promise<User[]> {
        return await this._userRepository.query(queries, options);
    }

    /**
     * Find user by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findBy(field: string, value: any): Promise<User[]> {
        const query = await this._userRepository.findBy(field, value);
        return query;
    }

    /**
     * Get by id.
     *
     * @param id The user id
     * @returns `User` object
     */
    async getById(id: string): Promise<User> {
        return await this._userRepository.findById(id);
    }

    /**
     * Creates user service
     * @param user
     * @returns create
     */
    async create(user: User): Promise<User> {
        const inserted = await this._userRepository.create(user);
        return inserted;
    }

    /**
     * Updates user service
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, user: User): Promise<User> {
        const users = await this.findBy('email', user.email);
        if (users.length > 0) {
            throw new HttpsError(
                ErrorCode.ALREADY_EXISTS,
                'The email address has already been associated with another account.'
            );
        }

        const updated = await this._userRepository.update(id, user);
        return updated;
    }

    /**
     * Deletes user service
     * @param id
     * @param [softDelete]
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return await this._userRepository.delete(id, softDelete);
    }
}
