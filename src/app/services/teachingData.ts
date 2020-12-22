import { provide } from 'inversify-binding-decorators';

import { TeachingData } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ITeachingDataRepository, ITutorRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { IDocumentReference, IQueryOption } from '@/infra/database/types';
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

    /**
     * Gets elite tutor data.
     * It will be used to recommend tutors and courses for new student which just registers new account.
     * @returns TeachingData[]
     */
    async getElites(limit: number = 10): Promise<TeachingData[]> {
        const options: Partial<IQueryOption<TeachingData>> = {
            orderBy: [
                {
                    field: 'completedMinute',
                    order: 'desc'
                },
                {
                    field: 'totalEarnedAmount',
                    order: 'desc'
                }
            ],
            limit
        };
        return this.query([], options);
    }
}
