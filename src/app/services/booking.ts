import * as cuid from 'cuid';
import { fireauth } from '@/infra/auth/firebase/types';
import { provide } from 'inversify-binding-decorators';
import { Booking } from '@/domain';
import { IBookingStatus } from '@/domain/types';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';
import { IRepository, IBookingRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { BookingDTO } from '@/api/http/requests';
import { BaseService } from './index';

@provide(TYPES.BookingService)
export class BookingService extends BaseService<Booking> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Booking> {
        return Container.get<IBookingRepository>(TYPES.BookingRepository);
    }

    public async createBooking(
        { paymentMethod, coupon, amount, type, objectId, bookedDate }: BookingDTO,
        user: fireauth.IUserRecord
    ): Promise<string> {
        const orderId = cuid();
        const userRef = this.getDocumentRef(`users/${user.uid}`);
        const couponRef = this.getDocumentRef(`coupons/${coupon}`);

        const booking = Booking.create({
            orderId,
            coupon: couponRef,
            student: userRef,
            amount,
            type,
            object: {},
            bookedDate,
            paymentMethod,
            status: IBookingStatus.PROCESSING
        });

        await this.create(booking);

        const data = {
            name: user.displayName,
            orderId
        };
        const notification = new EmailAdapter(user.email as string, TemplateType.BOOKING, data, Vendor.GMAIL);
        await notification.send();

        return orderId;
    }
}
