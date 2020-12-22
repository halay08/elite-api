//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { LearningStack } from '@/domain';
import { IRepository, ILearningStackRepository, ITutorRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { LearningStatus, IBookingEntity, ILearningStackEntity } from '@/src/domain/types';
import { ITutorLearningStackSummary } from '../types';
import { IDocumentReference } from '@/src/infra/database/types';
import { inject } from 'inversify';

@provide(TYPES.LearningStackService)
export class LearningStackService extends BaseService<LearningStack> {
    constructor(@inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository) {
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
    async getTeachingStackSummary(tutorId: string): Promise<ITutorLearningStackSummary> {
        const tutorRef = this.tutorRepository.getDocumentRef(tutorId);
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
    async getByTutor(tutor: IDocumentReference | string): Promise<LearningStack> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.tutorRepository.getDocumentRef(tutor);
        }

        const [record] = (await this.findBy('tutor', tutor)) || [];

        return record;
    }
}
