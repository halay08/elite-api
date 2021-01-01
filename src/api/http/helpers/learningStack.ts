import { LearningStack } from '@/src/domain';
import { ILearningStackEntity, LearningStatus } from '@/src/domain/types';
import { ILearningStackQuery } from '../requests';
import { IDocumentQuery } from '@/src/infra/database/types';
import { Joi, validate } from 'express-validation';

const getOperatorQueries = (queries: ILearningStackQuery): IDocumentQuery<LearningStack>[] => {
    const operatorQueries: IDocumentQuery<ILearningStackEntity>[] = [];
    const { status, student } = queries;

    operatorQueries.push({
        student,
        operator: '=='
    });

    if (status) {
        operatorQueries.push({
            status
        });
    }

    return operatorQueries;
};

const Validation = {
    get: {
        query: Joi.object({
            status: Joi.optional().valid(...Object.values(LearningStatus)),
            startAfter: Joi.string(),
            limit: Joi.number().integer()
        })
    }
};

const validateGet = validate(Validation.get);

export { getOperatorQueries, validateGet };
