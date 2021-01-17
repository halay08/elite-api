import { Student } from '@/domain';
import { IDocumentQuery } from '@/src/infra/database/types';

type ILearningStackQuery = {
    student: IDocumentQuery<Student>;

    status?: string;

    from?: number;

    to?: number;
};

type ILearningStackOption = {
    startAfter?: string;

    limit?: number;
};

type ILearningStackRequest = {
    status?: string;
    startAfter?: string;
    limit?: string;
    from?: string;
    to?: string;
};

export { ILearningStackRequest, ILearningStackQuery, ILearningStackOption };
