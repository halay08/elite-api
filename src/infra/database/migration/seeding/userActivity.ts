import { inject } from 'inversify';
import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Booking, UserActivity } from '@/domain';
import { UserActivityService, BookingService } from '@/src/app/services';
import { IUserActivityEntity, UserRole } from '@/src/domain/types';
import { BaseSeeding } from './base';
import { NotFoundError } from '@/app/errors';
import { IDocumentReference } from '@/infra/database/types';

@provide(TYPES.UserActivitySeeding)
export class UserActivitySeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.UserActivityService)
    private readonly userActivityService: UserActivityService;

    @inject(TYPES.BookingService)
    private readonly bookingService: BookingService;

    /**
     * Get bookings
     */
    private async getBookings(): Promise<Booking[]> {
        const bookings = await this.bookingService.query([], { limit: 10 });

        if (bookings.length === 0) {
            throw new NotFoundError('No booking found in the system');
        }

        return bookings;
    }

    /**
     * Gets booking references
     * @returns booking references
     */
    async getBookingReferences(): Promise<Array<IDocumentReference>> {
        const bookings: Booking[] = await this.getBookings();

        const bookingReferences: IDocumentReference[] = [];

        for (const booking of bookings) {
            const bookingEntity = booking.serialize();
            const bookingRef = this.bookingService.getDocumentRef(`${bookingEntity.id}`);
            bookingReferences.push(bookingRef);
        }

        return bookingReferences;
    }

    async run() {
        const userReferences = await this.getUserReferences(UserRole.STUDENT);
        const bookingReferences = await this.getBookingReferences();
        const activities: IUserActivityEntity[] = [
            {
                user: userReferences[0],
                action_name: 'Booked a full course',
                requestUrl: '/booking',
                ipAddress: '127.0.0.1',
                object: null as any
            },
            {
                user: userReferences[1],
                action_name: 'Booked a full course',
                requestUrl: '/booking',
                ipAddress: '127.0.0.1',
                object: null as any
            }
        ];

        for (const key in activities) {
            if (!bookingReferences[key]) {
                console.log(`Booking not found`);
                continue;
            }

            const activity = activities[key];
            activity.object = bookingReferences[key];

            const activityModel: UserActivity = UserActivity.create(activity);
            const newActivity = await this.userActivityService.create(activityModel);
            const newActivityEntity = newActivity.serialize();
            console.log(`New user activity was created ${newActivityEntity.id}`);
        }

        console.log('DONE!');
    }
}
