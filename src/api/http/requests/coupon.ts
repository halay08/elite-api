import { Joi, validate } from 'express-validation';

type CouponDTO = {
    code: string;
};

const CouponValidation = {
    create: {
        body: Joi.object({
            code: Joi.string().required()
        })
    }
};

const couponValidationMiddleWare = validate(CouponValidation.create);

export { CouponDTO, couponValidationMiddleWare };
