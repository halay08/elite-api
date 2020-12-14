import { Joi, validate } from 'express-validation';
import { IBookingPaymentMethod, IBookingType, BOOKING_TYPES, BOOKING_PAYMENT_METHOD } from '@/domain/types';

type BookingDTO = {
    paymentMethod: IBookingPaymentMethod;

    coupon: string;

    amount: number;

    type: IBookingType;

    objectId: string; // Id of session or course

    bookedDate: Date;
};

const BookingValidation = {
    create: {
        body: Joi.object({
            paymentMethod: Joi.string()
                .valid(...Object.values(BOOKING_PAYMENT_METHOD))
                .required(),
            coupon: Joi.string().email().optional(),
            amount: Joi.number().required(),
            type: Joi.string()
                .valid(...Object.values(BOOKING_TYPES))
                .required(),
            objectId: Joi.string().required(),
            bookedDate: Joi.date().required()
        })
    }
};

const bookingValidationMiddleWare = validate(BookingValidation.create);

export { BookingDTO, bookingValidationMiddleWare };
