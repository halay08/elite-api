import { Joi, validate } from 'express-validation';
import { IBookingPaymentMethod, BOOKING_PAYMENT_METHOD } from '@/domain/types';

type BookingDTO = {
    paymentMethod: IBookingPaymentMethod;

    coupon: string;

    amount: number;

    sessionId: string;

    tutorId: string;

    bookedDate: Date;
};

const BookingValidation = {
    create: {
        body: Joi.object({
            paymentMethod: Joi.string()
                .valid(...Object.values(BOOKING_PAYMENT_METHOD))
                .required(),
            coupon: Joi.string().optional(),
            amount: Joi.number().required(),
            sessionId: Joi.string().required(),
            tutorId: Joi.string().required(),
            bookedDate: Joi.date().required()
        })
    }
};

const bookingValidationMiddleWare = validate(BookingValidation.create);

export { BookingDTO, bookingValidationMiddleWare };
