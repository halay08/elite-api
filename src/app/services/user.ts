import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { IRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { NotFoundError } from '@/app/errors';

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
     * Updates fields document
     * @param id
     * @param object fields of document
     * @returns update
     */
    async updateFields(id: string, { ...args }): Promise<User> {
        const user = await this.getById(id);
        if (!user) {
            throw new NotFoundError(`User/${id} not found`);
        }

        const userEntity = user.serialize();
        const userData = User.create({ ...userEntity, ...args });
        return this.update(id, userData);
    }
}
