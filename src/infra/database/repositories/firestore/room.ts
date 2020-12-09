import { provide } from 'inversify-binding-decorators';
import { Room } from '@/domain';
import { RoomMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IRoomRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IRoomEntity } from '@/src/domain/types';

@provide(TYPES.RoomRepository)
export class RoomRepository extends BaseRepository<Room> implements IRoomRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.Room;
    }

    /**
     * Map fields to domain entity
     * @param room Entity raw field
     * @returns domain
     */
    protected toDomain(room: Room): Room {
        return RoomMapper.toDomain(room);
    }

    /**
     * Serialize domain entity
     * @param room Entity object
     * @returns serialize
     */
    protected serialize(room: Room): IRoomEntity {
        return room.serialize();
    }
}
