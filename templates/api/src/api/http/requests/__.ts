import { Joi, validate } from 'express-validation';

type ####DTO = {
    name: string;
};

const ####Validation = {
    create: {
        body: Joi.object({
            name: Joi.string().required()
        })
    }
};

const FFFFValidationMiddleWare = validate(####Validation.create);

export { ####DTO, FFFFValidationMiddleWare };
