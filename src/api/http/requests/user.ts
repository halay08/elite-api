import { Joi, validate } from 'express-validation';

export type NewUserPayload = {
    id: string;
    role: string;
    email: string;
    createdAt: string;
};

const Validation = {
    create: {
        body: Joi.object({
            role: Joi.string().optional(),
            email: Joi.string().email().required(),
            id: Joi.string().required()
        })
    },
    update: {
        body: Joi.object({
            role: Joi.string(),
            email: Joi.string().email(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional()
        })
    }
};

export const validateCreate = validate(Validation.create);
export const validateUpdate = validate(Validation.update);
