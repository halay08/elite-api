import { Joi, validate } from 'express-validation';
import { Student } from '@/src/domain';

export type UpdateStudentPayload = Partial<Student> & {
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
