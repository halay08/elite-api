import { IEmbedPaymentMethod, IEmbedBooking, IEntity, ITimstamp } from '.';

type IBookingPayment = {
    booking: IEmbedBooking;

    paymentMethod: IEmbedPaymentMethod;

    /**
     * Momo/VNPAY order id
     */
    orderId: string;

    /**
     * Momo/VNPAY transaction id
     */
    transactionId: string;

    amount: number;
};

/**
 * Booking Payment entity
 */
type IBookingPaymentEntity = IEntity & IBookingPayment & ITimstamp;

export { IBookingPayment, IBookingPaymentEntity };
