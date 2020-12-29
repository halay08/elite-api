import { provide } from 'inversify-binding-decorators';

import { TutorReviewerSummary } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ITutorReviewerSummaryRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';

@provide(TYPES.TutorReviewerSummaryService)
export class TutorReviewerSummaryService extends BaseService<TutorReviewerSummary> {
    /**
     * Gets base repository instance
     * @returns @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<TutorReviewerSummary> {
        return Container.get<ITutorReviewerSummaryRepository>(TYPES.TutorReviewerSummaryRepository);
    }
}
