import { provide } from 'inversify-binding-decorators';

import { TutorReviewer } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ITutorReviewerRepository, IUserRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { IDocumentReference } from '@/infra/database/types';
import { inject } from 'inversify';

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
}
