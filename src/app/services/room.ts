import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import Room from '@/domain/room';
import { IRoomRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { NotFoundError } from '@/app/errors/notFound';

@provide(TYPES.RoomService)
export default class RoomService {
    constructor(
        @inject(TYPES.RoomRepository)
        private readonly roomRepository: IRoomRepository
    ) {}

    public async getAll(): Promise<Room[]> {
        return await this.roomRepository.findAll();
    }

    public async getById(id: string): Promise<Room> {
        return await this.roomRepository.findById(id);
    }

    public async create(room: Partial<Room>): Promise<Room> {
        return await this.roomRepository.create(room);
    }

    /**
     * Find user by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findByRoomName(value: string): Promise<Room> {
        const query = await this.roomRepository.findBy('name', value);
        const [room]: Array<Room> = query || [];

        if (!room) throw new NotFoundError('Room is not found');

        return room;
    }

    public async update(id: string, room: Partial<Room>): Promise<Room> {
        return await this.roomRepository.update(id, room);
    }

    public async delete(id: string, softDelete: boolean = true): Promise<number> {
        return await this.roomRepository.delete(id, softDelete);
    }
}
