import { provide } from 'inversify-binding-decorators';

import { TutorReviewer } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ITutorReviewerRepository, IUserRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { IDocumentReference, IQuery, IQueryOption } from '@/infra/database/types';
import { inject } from 'inversify';
import { DEFAULT_PAGE_LIMIT } from '../types';

@provide(TYPES.TutorReviewerService)
export class TutorReviewerService extends BaseService<TutorReviewer> {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    /**
     * Gets base repository instance
     * @returns @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<TutorReviewer> {
        return Container.get<ITutorReviewerRepository>(TYPES.TutorReviewerRepository);
    }

    /**
     * Gets by tutor
     * @param tutor Reference to a tutor or tutor id
     * @returns TutorReviewer
     */
    async getByTutor(tutor: IDocumentReference | string): Promise<TutorReviewer[]> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.userRepository.getDocumentRef(tutor);
        }

        return await this.findBy('tutor', tutor);
    }

    /**
     * Paginates tutor reviewers
     * @param tutor Tutor reference or tutor ID
     * @param lastDocument Last previous document reference or ID
     * @param [limit] Limit records per page
     * @returns TutorReviewer[]
     */
    async paginate(
        tutor: IDocumentReference | string,
        lastDocument: IDocumentReference | string,
        limit = DEFAULT_PAGE_LIMIT
    ): Promise<TutorReviewer[]> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.userRepository.getDocumentRef(tutor);
        }

        const queryOption: Partial<IQueryOption<TutorReviewer>> = {};
        queryOption.limit = limit;

        if (lastDocument) {
            const ref = typeof lastDocument === 'string' ? this.getDocumentRef(lastDocument) : lastDocument;
            queryOption.startAfter = await ref.get();
        }

        const operatorQueries: IQuery<TutorReviewer>[] = [
            {
                tutor
            }
        ];

        return this.query(operatorQueries, queryOption);
    }
}
