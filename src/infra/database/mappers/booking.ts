import { Booking } from '@/domain';

/**
 * Booking mapper
 */
export class BookingMapper {
    public static toDomain(raw: any): Booking {
        return Booking.create({
            orderId: raw.orderId,

            paymentMethod: raw.paymentMethod,

            student: raw.student,

            coupon: raw.coupon,

            amount: raw.amount,

            type: raw.type,

            object: raw.object,

            bookedDate: raw.bookedDate,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
