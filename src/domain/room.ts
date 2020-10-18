import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export enum IRoomStatus {
    BUSY = 'busy',
    AVAILABBLE = 'available'
}

export type IRoom = {
    /**
     * Name  of room entity
     */
    name: string;

    /**
     * Alias  of room entity
     */
    alias: string;

    status: IRoomStatus;
};

/**
 * Room entity
 */
export type IRoomEntity = domain.IEntity & Required<IRoom> & domain.ITimstamp;

// Collection: rooms
@injectable()
export default class Room extends Entity<IRoomEntity> {
    constructor(props: IRoomEntity, _id?: string) {
        super(props, _id);
    }
}
