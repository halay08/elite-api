import { LearningStack } from '@/src/domain';
import { ILearningStackEntity, LearningStatus } from '@/src/domain/types';
import { ILearningStackQuery } from '../requests';
import { IDocumentQuery } from '@/src/infra/database/types';
import { Joi, validate } from 'express-validation';

const getOperatorQueries = (queries: ILearningStackQuery): IDocumentQuery<LearningStack>[] => {
    const operatorQueries: IDocumentQuery<ILearningStackEntity>[] = [];
    const { status, student, from, to } = queries;

    operatorQueries.push({
        student,
        operator: '=='
    });

    if (status) {
        operatorQueries.push({
            status
        });
    }

    if (from) {
        operatorQueries.push({
            startTime: new Date(from * 1000),
            operator: '>='
        });
    }

    if (to) {
        operatorQueries.push({
            startTime: new Date(to * 1000),
            operator: '<='
        });
    }

    return operatorQueries;
};

const Validation = {
    get: {
        query: Joi.object({
            status: Joi.optional().valid(...Object.values(LearningStatus)),
            startAfter: Joi.string(),
            limit: Joi.number().integer(),
            from: Joi.number().integer(),
            to: Joi.number().integer()
        })
    }
};

const validateGet = validate(Validation.get);

export { getOperatorQueries, validateGet };
