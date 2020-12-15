//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { LearningStack } from '@/domain';
import { IRepository, ILearningStackRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { COLLECTIONS } from '@/infra/database/config/collection';
import { LearningStatus, IBookingEntity, ILearningStackEntity } from '@/src/domain/types';
import { ITutorLearningStackSummary } from '../types';

@provide(TYPES.LearningStackService)
export class LearningStackService extends BaseService<LearningStack> {
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
    async getTutorLearningStackSummary(tutorId: string): Promise<ITutorLearningStackSummary> {
        const tutorRef = this.baseRepository.getDocumentRef(`${COLLECTIONS.Tutor}/${tutorId}`);
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
}
