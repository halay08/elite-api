import { provide } from 'inversify-binding-decorators';
import { SessionStack } from '@/domain';
import { SessionStackMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ISessionStackRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ISessionStackEntity } from '@/src/domain/types';

@provide(TYPES.SessionStackRepository)
export class SessionStackRepository extends BaseRepository<SessionStack> implements ISessionStackRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.SessionStack;
    }

    /**
     * Map fields to domain entity
     * @param item Entity raw field
     * @returns domain
     */
    protected toDomain(item: SessionStack): SessionStack {
        return SessionStackMapper.toDomain(item);
    }

    /**
     * Serialize domain entity
     * @param item Entity object
     * @returns serialize
     */
    protected serialize(item: SessionStack): ISessionStackEntity {
        return item.serialize();
    }
}
