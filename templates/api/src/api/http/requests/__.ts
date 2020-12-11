import { Joi, validate } from 'express-validation';
import { I####Type } from '@/domain/types';

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
