import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Container from '@/src/container';
import TYPES from '@/src/types';
import { ScheduledTaskService, RoomService } from '@/app/services';
import { ScheduledTaskStatus, ScheduledTaskEmailOptions, RoomStatus } from '@/domain/types';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';
import { timezone } from './configs/runtime';
import { functionLog } from '@/api/http/helpers';

// Optional interface, all worker functions should return Promise.
interface Workers {
    [key: string]: (options: any) => Promise<any>;
}

// Business logic for named tasks. Function name should match worker field on task document.
const workers: Workers = {
    email: async (options: ScheduledTaskEmailOptions) => {
        const { email, data, template } = options;
        const { orderId = undefined } = data as any;

        if (!orderId) return Promise.reject(new Error('OrderId not found'));

        // Send email
        const notification = new EmailAdapter(email, template as TemplateType, data, Vendor.GMAIL);
        notification.send();

        // Change room status to ready
        const roomService = Container.get<RoomService>(TYPES.RoomService);
        const [getVideoRoom] = await roomService.findBy('name', orderId);
        const videoRoom = getVideoRoom.serialize();
        const { id: roomId } = videoRoom;

        return roomService.update(roomId as string, { status: RoomStatus.AVAILABBLE });
    }
};

export const everyFiveMinutes = functions.pubsub
    .schedule('every 5 minutes')
    .timeZone(timezone)
    .onRun(async () => {
        const now = admin.firestore.Timestamp.now();

        const scheduledTaskService = Container.get<ScheduledTaskService>(TYPES.ScheduledTaskService);
        const scheduledTasks = await scheduledTaskService.query([
            { performAt: now, operator: '<=' },
            { status: ScheduledTaskStatus.SCHEDULED, operator: '==' }
        ]);

        const tasks = scheduledTasks.map(async (task) => {
            const { id, method, options } = task.serialize();
            try {
                await workers[method](options);

                return scheduledTaskService.update(id as string, { status: ScheduledTaskStatus.COMPLETE });
            } catch ({ message }) {
                functionLog(message);
                return scheduledTaskService.update(id as string, { status: ScheduledTaskStatus.ERROR });
            }
        });

        return Promise.all(tasks).catch(({ message }) => {
            throw new Error(message);
        });
    });
