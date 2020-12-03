import { provide } from 'inversify-binding-decorators';
import { Room } from '@/domain';
import { RoomMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IRoomRepository } from '../roomRepositoryInterface';
import BaseRepository from './baseRepository';
import { IQueryOption } from '@/infra/database/types';
import { IFirestoreQuery } from '../../firestore/types';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.RoomRepository)
export class RoomRepository extends BaseRepository<Room> implements IRoomRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return 'rooms';
    }

    /**
     * Querys room repository
     * @template Room
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IFirestoreQuery<Room>[] = [], options: Partial<IQueryOption<Room>> = {}): Promise<Room[]> {
        const docs = await this.collection.query(queries, options);
        return docs.map((item) => RoomMapper.toDomain(item));
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(): Promise<Room[]> {
        const rooms = await this.collection.findAll();
        return rooms.map((item) => RoomMapper.toDomain(item));
    }

    /**
     * Finds by id
     * @param id
     * @returns by id
     */
    async findById(id: string): Promise<Room> {
        const room = await this.collection.findById(id);
        if (!room) {
            throw new NotFoundError('Room is not found');
        }

        return RoomMapper.toDomain(room);
    }

    /**
     * Creates room repository
     * @param room
     * @returns create
     */
    async create(roomModel: Room): Promise<Room> {
        try {
            const dto = roomModel.serialize();
            const { id } = dto;

            if (id) {
                await this.collection.set(id, dto);
                return roomModel;
            }

            const room = await this.collection.create(dto);
            return RoomMapper.toDomain(room);
        } catch (error) {
            throw new HttpsError('invalid-argument', error);
        }
    }

    /**
     * Updates room repository
     * @param id
     * @param room
     * @returns update
     */
    async update(id: string, room: Room): Promise<Room> {
        const dto = room.serialize();
        await this.collection.update(id, dto);

        return RoomMapper.toDomain(room);
    }

    /**
     * Deletes room repository
     * @param id
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return (await this.collection.delete(id, softDelete)).writeTime.seconds;
    }
}
