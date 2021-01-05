import { IEntity, ITimestamp } from '.';

enum RoomStatus {
    BUSY = 'busy',
    NOT_READY = 'not_ready',
    AVAILABBLE = 'available'
}

type IRoom = {
    name: string;

    studentId: string;

    tutorId: string;

    status: RoomStatus;
};

/**
 * Room entity
 */
type IRoomEntity = IEntity & Required<IRoom> & ITimestamp;

export { IRoom, IRoomEntity, RoomStatus };
