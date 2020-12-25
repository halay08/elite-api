import { Booking } from '@/domain';

/**
 * Booking mapper
 */
export class BookingMapper {
    public static toDomain(raw: any): Booking {
        return Booking.create({
            id: raw.id,

            student: raw.student,

            tutor: raw.tutor,

            originSession: raw.originSession,

            bookingSession: raw.bookingSession,

            orderId: raw.orderId,

            bookedDate: raw.bookedDate,

            paymentMethod: raw.paymentMethod,

            coupon: raw.coupon,

            amount: raw.amount,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
