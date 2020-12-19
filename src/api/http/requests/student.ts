import { Joi, validate } from 'express-validation';

export type UpdateStudentPayload = {
    studyTitle?: string;
    studyPlace?: string;
    jobTitle?: string;
    jobPlace?: string;
    shortIntro?: string;
};

const Validation = {
    update: {
        body: Joi.object({
            studyTitle: Joi.string().optional(),
            studyPlace: Joi.string().optional(),
            jobTitle: Joi.string().optional(),
            jobPlace: Joi.string().optional(),
            shortIntro: Joi.string().optional()
        })
    }
};

export const validateUpdate = validate(Validation.update);
