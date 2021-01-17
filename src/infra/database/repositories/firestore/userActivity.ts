import { provide } from 'inversify-binding-decorators';
import { UserActivity } from '@/domain';
import { UserActivityMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IUserActivityRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IUserActivityEntity } from '@/src/domain/types';

@provide(TYPES.UserActivityRepository)
export class UserActivityRepository extends BaseRepository<UserActivity> implements IUserActivityRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.UserActivity;
    }

    /**
     * Map fields to domain entity
     * @param item Entity raw field
     * @returns domain
     */
    protected toDomain(item: UserActivity): UserActivity {
        return UserActivityMapper.toDomain(item);
    }

    /**
     * Serialize domain entity
     * @param item Entity object
     * @returns serialize
     */
    protected serialize(item: UserActivity): IUserActivityEntity {
        return item.serialize();
    }
}
