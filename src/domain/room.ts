import { injectable } from 'inversify';

import { Entity } from './entity';
import { IRoomEntity } from './types';

// Collection: rooms
@injectable()
export default class Room extends Entity<IRoomEntity> {
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
}
