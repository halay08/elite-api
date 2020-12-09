import { Tutor } from '@/src/domain';
import { ITutorQuery, TutorFilterStatus } from '../requests';
import { TutorStatus, ITutorEntity } from '@/domain/types';
import { IDocumentQuery } from '@/src/infra/database/types';

/**
 * Get operator queries for tutor list
 * @param queries
 */
const getOperatorQueries = (queries: ITutorQuery): IDocumentQuery<Tutor>[] => {
    const operatorQueries: IDocumentQuery<Tutor>[] = [];

    const { category, expertise, status } = queries;

    if (status === TutorFilterStatus.ONLINE) {
        operatorQueries.push({ activeStatus: TutorStatus.ACTIVE });
    }

    if (category) {
        const key = 'category.slug' as keyof ITutorEntity;
        operatorQueries.push({ [key]: queries.category });
    }

    if (expertise) {
        operatorQueries.push({
            expertises: queries.expertise,
            operator: 'array-contains'
        });
    }

    return operatorQueries;
};

export { getOperatorQueries };
