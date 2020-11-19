import { IEntity, ITimstamp } from '.';
enum IRoomStatus {
    BUSY = 'busy',
    AVAILABBLE = 'available'
}

type IRoom = {
    /**
     * Name  of room entity
     */
    name: string;

    /**
     * Alias  of room entity
     */
    slug: string;

    status: IRoomStatus;
};

/**
 * Room entity
 */
type IRoomEntity = IEntity & Required<IRoom> & ITimstamp;

export { IRoom, IRoomEntity };
