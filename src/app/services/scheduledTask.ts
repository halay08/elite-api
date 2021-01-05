//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { ScheduledTask } from '@/domain';
import { IRepository, IScheduledTaskRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.ScheduledTaskService)
export class ScheduledTaskService extends BaseService<ScheduledTask> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<ScheduledTask> {
        return Container.get<IScheduledTaskRepository>(TYPES.ScheduledTaskRepository);
    }
}
