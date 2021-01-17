//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { LearningStack } from '@/domain';
import { IRepository, ILearningStackRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { ILearningStackEntity } from '@/src/domain/types';
import { getOperatorQueries } from '../../api/http/helpers/learningStack';
import { TutorService } from '@/src/app/services';
import { IDocumentReference, IQueryOption } from '@/src/infra/database/types';
import { inject } from 'inversify';
import { ISerializedLearningStack, IGetLearningStackParams } from '@/src/app/types/learningStack';
import { LIMIT } from '@/src/api/http/config/pagination';
import { NotFoundError } from '@/app/errors/notFound';

@provide(TYPES.LearningStackService)
export class LearningStackService extends BaseService<LearningStack> {
    constructor(
        @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.TutorService) private tutorService: TutorService
    ) {
        super();
    }

    /**
     * Create booking repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<LearningStack> {
        return Container.get<ILearningStackRepository>(TYPES.LearningStackRepository);
    }

    /**
     * Find learning stack by orderId.
     *
     * @param orderId string
     * @return LearningStack
     */
    async getByOrderId(orderId: string): Promise<LearningStack> {
        const query = await this.baseRepository.query([{ orderId: orderId, operator: '==' }]);

        const [learningStack]: Array<LearningStack> = query || [];

        if (!learningStack) throw new NotFoundError('LearningStack is not found');

        return learningStack;
    }

    /**
     * Gets by tutor
     * @param tutor Reference to a tutor or tutor id
     * @returns LearningStack
     */
    async getByTutor(tutor: IDocumentReference | string): Promise<LearningStack[]> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.userRepository.getDocumentRef(tutor);
        }

        return this.findBy('tutor', tutor);
    }

    /**
     * Get by student uid
     * @param uid User id
     * @param status Learning status
     * @param page Page
     * @param limit Limitation on page
     * @returns ISerializedLearningStack[]
     */
    async getByStudentId(params: IGetLearningStackParams): Promise<ISerializedLearningStack[]> {
        const { uid = '', status = '', startAfter = '', limit = 0, from = 0, to = 0 } = params;
        const studentRef = this.userRepository.getDocumentRef(uid);

        const operatorQueries = getOperatorQueries({ student: studentRef, status, from, to });

        const queryOptions: Partial<IQueryOption<LearningStack>> = {};

        queryOptions.limit = limit || LIMIT;

        if (startAfter) {
            const ref = this.getDocumentRef(startAfter);
            queryOptions.startAfter = await ref.get();
        }

        queryOptions.orderBy = [
            {
                field: 'startTime',
                order: 'desc'
            }
        ];

        const stacks = await this.query(operatorQueries, queryOptions);

        const serialized = await Promise.all(
            stacks.map(async (stack) => {
                const data: ILearningStackEntity = stack.serialize();
                const tutor = await this.tutorService.getByUser(data.tutor.id);
                return { ...data, tutor: tutor.serialize() };
            })
        );

        return serialized;
    }
}
