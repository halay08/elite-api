import { Joi, validate } from 'express-validation';

export type momoWalletDTO = {
    requestId: string;
    amount: string;
    orderId: string;
    orderInfo: string;
    extraData?: string;
};

const Validation = {
    momo: {
        body: Joi.object({
            amount: Joi.string().required(),
            orderInfo: Joi.string().required(),
            extraData: Joi.string().required()
        })
    }
};

export const validateMomoTransaction = validate(Validation.momo);
