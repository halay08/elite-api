import { provide } from 'inversify-binding-decorators';
import { Session } from '@/domain';
import { SessionMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ISessionRepository } from '../interfaces/session';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ISessionEntity } from '@/src/domain/types';

@provide(TYPES.SessionRepository)
export class SessionRepository extends BaseRepository<Session> implements ISessionRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.Session;
    }

    /**
     * Map fields to domain entity
     * @param session Entity raw field
     * @returns domain
     */
    protected toDomain(session: Session): Session {
        return SessionMapper.toDomain(session);
    }

    /**
     * Serialize domain entity
     * @param session Entity object
     * @returns serialize
     */
    protected serialize(session: Session): ISessionEntity {
        return session.serialize();
    }
}
