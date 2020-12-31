//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { LearningStack } from '@/domain';
import { IRepository, ILearningStackRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { LearningStatus, IBookingEntity, ILearningStackEntity } from '@/src/domain/types';
import { ITutorLearningStackSummary } from '../types';
import { getOperatorQueries } from '../../api/http/helpers/learningStack';
import { TutorService } from '@/src/app/services';
import { IDocumentReference, IQueryOption } from '@/src/infra/database/types';
import { inject } from 'inversify';
import { ISerializedLearningStack, IGetLearningStackParams } from '@/src/app/types/learningStack';
import { LIMIT } from '@/src/api/http/config/pagination';

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
     * Gets learning stack summary
     * @param tutorId ID of tutor uses to query the learning sessions
     * @returns ITutorLearningStackSummary
     */
    async getTutorStackSummary(tutorId: string): Promise<ITutorLearningStackSummary> {
        const tutorRef = this.userRepository.getDocumentRef(tutorId);
        let stacks: LearningStack[] = await this.findBy('tutor', tutorRef);
        stacks = await this.getAll();

        const completeStacks = stacks.filter((b) => b.props.status === LearningStatus.COMPLETED);
        const missedStacks = stacks.filter((b) => b.props.status === LearningStatus.MISSED_TUTOR);

        const totalHour: number = completeStacks.reduce((acc, cur) => {
            const stackEntity: ILearningStackEntity = cur.serialize();
            const booking: IBookingEntity = stackEntity.booking as any;
            const { duration } = booking.bookingSession;
            return acc + duration;
        }, 0);

        return {
            completed: completeStacks.length,
            missed: missedStacks.length,
            totalHour: totalHour / 60
        };
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
        const { uid = '', status = '', startAfter = '', limit = 0 } = params;
        const studentRef = this.userRepository.getDocumentRef(uid);

        const operatorQueries = getOperatorQueries({ student: studentRef, status });

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
