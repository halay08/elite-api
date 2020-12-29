import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { IRepository, ITutorRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { TutorStatus } from '@/src/domain/types';
import { inject } from 'inversify';
import { TeachingDataService } from '.';
import { IDocumentReference, IQuery, IQueryOption } from '@/src/infra/database/types';

@provide(TYPES.TutorService)
export class TutorService extends BaseService<Tutor> {
    constructor(
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.TeachingDataService) private readonly teachingDataService: TeachingDataService
    ) {
        super();
    }

    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Tutor> {
        return Container.get<ITutorRepository>(TYPES.TutorRepository);
    }

    /**
     * Creates tutor.
     * @param id User id
     * @returns created
     */
    async createByUserId(id: string): Promise<Tutor> {
        const userRef = this.userRepository.getDocumentRef(id);
        const [existed] = await this.findBy('user', userRef);
        if (existed) {
            return existed;
        }

        const tutor: Tutor = Tutor.create({ id, user: userRef, activeStatus: TutorStatus.ACTIVE });
        const created = await this.create(tutor);
        return created;
    }

    /**
     * Gets elite tutors.
     * It will be used to recommend tutors and courses for new student which just registers new account.
     * @returns TeachingData[]
     */
    async getElites(limit: number = 10): Promise<Tutor[]> {
        const queries: IQuery<Tutor>[] = [];
        const options: Partial<IQueryOption<Tutor>> = {
            limit,
            orderBy: []
        };

        const eliteTeachingData = await this.teachingDataService.getElites();

        const tutorIDs: string[] = eliteTeachingData.map((item) => {
            const teachingData = item.serialize();
            return teachingData.tutor.id || '';
        });

        // Query top tutors which have the highest complete sessions and total of earned amount
        if (tutorIDs.length > 0) {
            queries.push({
                id: tutorIDs,
                operator: 'in'
            });
        } else {
            options.orderBy = [
                {
                    field: 'happyUsers',
                    order: 'desc'
                },
                {
                    field: 'reviews',
                    order: 'desc'
                }
            ];
        }

        return this.query(queries, options);
    }

    /*
     * Gets by user
     * @param user Reference to a user or user id
     * @returns Tutor
     */
    async getByUser(user: IDocumentReference | string): Promise<Tutor> {
        if (typeof user === 'string') {
            // eslint-disable-next-line no-param-reassign
            user = this.userRepository.getDocumentRef(user);
        }

        const [record] = (await this.findBy('user', user)) || [];

        return record;
    }
}
