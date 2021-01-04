import Container from '@/src/container';
import TYPES from '@/src/types';
import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { Room } from '@/domain';
import { IRoomEntity } from '@/domain/types';
import { RoomService } from '../index';

export class VideoCallHandler extends AbstractHandler<Room> {
    public handle({ name, data, id }: IPaymentRequestHandler<Room>): Promise<Room> {
        if (name === ChainOfEvents.VIDEOCALL_HANDLER) {
            const roomService = Container.get<RoomService>(TYPES.RoomService);

            const videoCall: Room = Room.create(data as IRoomEntity);
            const updateRoomStatus = roomService.create(videoCall);

            return updateRoomStatus;
        }

        return super.handle({ name, data, id });
    }
}
