//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { SessionStack } from '@/domain';
import { IRepository, ISessionStackRepository, ITutorRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { LearningStatus, IBookingEntity, ISessionStackEntity } from '@/src/domain/types';
import { ITutorSessionStackSummary } from '../types';
import { IDocumentReference } from '@/src/infra/database/types';
import { inject } from 'inversify';

@provide(TYPES.SessionStackService)
export class SessionStackService extends BaseService<SessionStack> {
    constructor(@inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository) {
        super();
    }

    /**
     * Create booking repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<SessionStack> {
        return Container.get<ISessionStackRepository>(TYPES.SessionStackRepository);
    }

    /**
     * Gets learning stack summary
     * @param tutorId ID of tutor uses to query the learning sessions
     * @returns ITutorSessionStackSummary
     */
    async getTeachingStackSummary(tutorId: string): Promise<ITutorSessionStackSummary> {
        const tutorRef = this.tutorRepository.getDocumentRef(tutorId);
        let stacks: SessionStack[] = await this.findBy('tutor', tutorRef);
        stacks = await this.getAll();

        const completeStacks = stacks.filter((b) => b.props.status === LearningStatus.COMPLETED);
        const missedStacks = stacks.filter((b) => b.props.status === LearningStatus.MISSED_TUTOR);

        const totalHour: number = completeStacks.reduce((acc, cur) => {
            const stackEntity: ISessionStackEntity = cur.serialize();
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
     * @returns SessionStack
     */
    async getByTutor(tutor: IDocumentReference | string): Promise<SessionStack> {
        if (typeof tutor === 'string') {
            // eslint-disable-next-line no-param-reassign
            tutor = this.tutorRepository.getDocumentRef(tutor);
        }

        const [record] = (await this.findBy('tutor', tutor)) || [];

        return record;
    }
}
