import { IEntity, ITimestamp } from '.';

enum RoomStatus {
    BUSY = 'busy',
    AVAILABBLE = 'available'
}

type IRoom = {
    name?: string;

    studentId: string;

    teacherId: string;

    status: RoomStatus;
};

/**
 * Room entity
 */
type IRoomEntity = IEntity & Required<IRoom> & ITimestamp;

export { IRoom, IRoomEntity, RoomStatus };
