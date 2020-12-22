import { provide } from 'inversify-binding-decorators';

import { TeachingData } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ITeachingDataRepository, ITutorRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { IDocumentReference } from '@/infra/database/types';
import { inject } from 'inversify';

@provide(TYPES.TeachingDataService)
export class TeachingDataService extends BaseService<TeachingData> {
    constructor(@inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository) {
        super();
    }

    /**
     * Create course repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<TeachingData> {
        return Container.get<ITeachingDataRepository>(TYPES.TeachingDataRepository);
    }

    /**
     * Gets by tutor
     * @param tutor Reference to a tutor or tutor id
     * @returns TeachingData
     */
    async getByTutor(tutor: IDocumentReference | string): Promise<TeachingData> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.tutorRepository.getDocumentRef(tutor);
        }

        const [record] = (await this.findBy('tutor', tutor)) || [];

        return record;
    }
}
