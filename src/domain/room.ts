import { injectable } from 'inversify';

import { Entity } from './entity';
import { IRoomEntity, RoomStatus } from './types';

// Collection: rooms
@injectable()
export class Room extends Entity<IRoomEntity> {
    constructor(props: IRoomEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Room properties
     * @returns Room
     */
    public static create(props: IRoomEntity): Room {
        const instance = new Room(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    get status(): RoomStatus {
        return this.props.status || RoomStatus.AVAILABBLE;
    }
}
