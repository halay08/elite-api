//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { IRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { ErrorCode, HttpsError } from '@/app/errors';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.UserService)
export class UserService extends BaseService<User> {
    /**
     * Create user repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<User> {
        return Container.get<IUserRepository>(TYPES.UserRepository);
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

        const updated = await this.baseRepository.update(id, user);
        return updated;
    }
}
