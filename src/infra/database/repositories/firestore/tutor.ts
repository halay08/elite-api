import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { TutorMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ITutorRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ITutorEntity } from '@/domain/types';

@provide(TYPES.TutorRepository)
export class TutorRepository extends BaseRepository<Tutor> implements ITutorRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.Tutor;
    }

    /**
     * Map fields to domain entity
     * @param tutor Entity raw field
     * @returns domain
     */
    protected toDomain(tutor: Tutor): Tutor {
        return TutorMapper.toDomain(tutor);
    }

    /**
     * Serialize domain entity
     * @param tutor Entity object
     * @returns serialize
     */
    protected serialize(tutor: Tutor): ITutorEntity {
        return tutor.serialize();
    }
}
