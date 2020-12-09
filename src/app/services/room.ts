import { provide } from 'inversify-binding-decorators';

import { Room } from '@/domain';
import TYPES from '@/src/types';
import { NotFoundError } from '@/app/errors/notFound';
import { BaseService } from './base';
import { IRepository, IRoomRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';

@provide(TYPES.RoomService)
export class RoomService extends BaseService<Room> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Room> {
        return Container.get<IRoomRepository>(TYPES.RoomRepository);
    }

    /**
     * Find user by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findByRoomName(value: string): Promise<Room> {
        const query = await this.baseRepository.findBy('name', value);
        const [room]: Array<Room> = query || [];

        if (!room) throw new NotFoundError('Room is not found');

        return room;
    }
}
