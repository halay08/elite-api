//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { ScheduledTask } from '@/domain';
import { ScheduledTaskStatus } from '@/domain/types';
import { IRepository, IScheduledTaskRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { getCurrentUTCDate } from '@/app/helpers';

@provide(TYPES.ScheduledTaskService)
export class ScheduledTaskService extends BaseService<ScheduledTask> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<ScheduledTask> {
        return Container.get<IScheduledTaskRepository>(TYPES.ScheduledTaskRepository);
    }

    /**
     * Verify coupon
     *
     * @param {string} coupon
     * @returns {string} id of the entity
     * @memberof ScheduledTaskService
     */
    public async verifyScheduledTask(): Promise<Partial<ScheduledTask> | null> {
        const now = getCurrentUTCDate();
        const [couponCode] = await this.query([
            { performAt: now, operator: '<=' },
            { status: ScheduledTaskStatus.SCHEDULED, operator: '==' }
        ]);

        return isEmpty(couponCode) || typeof couponCode === undefined ? null : couponCode.serialize();
    }
}
