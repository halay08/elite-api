import { provide } from 'inversify-binding-decorators';
import { #### } from '@/domain';
import { ####Mapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { I####Repository } from '../interfaces';
import BaseRepository from './base';
import { COLLECTIONS } from '../../config/collection';
import { I####Entity } from '@/domain/types';

@provide(TYPES.####Repository)
export class ####Repository extends BaseRepository<####> implements I####Repository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.####;
    }

    /**
     * Map fields to domain entity
     * @param FFFF Entity raw field
     * @returns domain
     */
    protected toDomain(FFFF: ####): #### {
        return ####Mapper.toDomain(FFFF);
    }

    /**
     * Serialize domain entity
     * @param data Entity object
     * @returns serialize
     */
    protected serialize(data: ####): I####Entity {
        return data.serialize();
    }
}
