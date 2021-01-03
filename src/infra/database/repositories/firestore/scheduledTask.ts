import { provide } from 'inversify-binding-decorators';
import { ScheduledTask } from '@/domain';
import { ScheduledTaskMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IScheduledTaskRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IScheduledTaskEntity } from '@/src/domain/types';

@provide(TYPES.ScheduledTaskRepository)
export class ScheduledTaskRepository extends BaseRepository<ScheduledTask> implements IScheduledTaskRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.ScheduledTask;
    }

    /**
     * Map fields to domain entity
     * @param scheduledTask Entity raw field
     * @returns domain
     */
    protected toDomain(scheduledTask: ScheduledTask): ScheduledTask {
        return ScheduledTaskMapper.toDomain(scheduledTask);
    }

    /**
     * Serialize domain entity
     * @param scheduledTask Entity object
     * @returns serialize
     */
    protected serialize(scheduledTask: ScheduledTask): IScheduledTaskEntity {
        return scheduledTask.serialize();
    }
}
