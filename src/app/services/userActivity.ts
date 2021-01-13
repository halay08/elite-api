import { provide } from 'inversify-binding-decorators';
import { UserActivity } from '@/domain';
import { IRepository, IUserActivityRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.UserActivityService)
export class UserActivityService extends BaseService<UserActivity> {
    /**
     * Create user activity repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<UserActivity> {
        return Container.get<IUserActivityRepository>(TYPES.UserActivityRepository);
    }
}
