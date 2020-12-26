import { Joi, validate } from 'express-validation';
import { isJSON } from '@/app/helpers';

export type momoWalletDTO = {
    amount: string;
    orderInfo: string;
    extraData: string;
};

const Validation = {
    momo: {
        body: Joi.object({
            amount: Joi.string().required(),
            orderInfo: Joi.string().optional(),
            extraData: Joi.string()
                .custom((value, helper) => {
                    if (!isJSON(value)) {
                        return (helper as any).message('Extra data is invalid JSON format');
                    }

                    return true;
                })
                .required()
        })
    },
    momoIPN: {
        body: Joi.object({
            requestId: Joi.string().required(),
            orderId: Joi.string().required(),
            orderInfo: Joi.string().optional(),
            orderType: Joi.string().required(),
            transId: Joi.string().required(),
            errorCode: Joi.number().required(),
            message: Joi.string().required(),
            localMessage: Joi.string().required(),
            payType: Joi.string().required(),
            responseTime: Joi.string().required(),
            extraData: Joi.string()
                .custom((value, helper) => {
                    if (!isJSON(value)) {
                        return (helper as any).message('Extra data is invalid JSON format');
                    }

                    return true;
                })
                .required(),
            signature: Joi.string().required(),
            amount: Joi.string().required()
        })
    }
};

export const validateCreateMomoWallet = validate(Validation.momo);
export const validateMomoIPN = validate(Validation.momoIPN);
