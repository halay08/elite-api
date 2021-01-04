import Container from '@/src/container';
import TYPES from '@/src/types';
import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { Booking } from '@/domain';
import { BookingService } from '../index';

export class BookingHandler extends AbstractHandler<Booking> {
    public handle({ name, data, id }: IPaymentRequestHandler<Booking>): Promise<Booking> {
        if (name === ChainOfEvents.BOOKING_HANDLER) {
            const bookingService = Container.get<BookingService>(TYPES.BookingService);

            const updateBookingStatus = bookingService.update(id, data);

            return updateBookingStatus;
        }

        return super.handle({ name, data, id });
    }
}
