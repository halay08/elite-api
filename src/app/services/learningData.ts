import { provide } from 'inversify-binding-decorators';

import { LearningData } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ILearningDataRepository, IUserRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { IDocumentReference } from '@/infra/database/types';
import { inject } from 'inversify';
import { ILearningDataSummary } from '../types';

@provide(TYPES.LearningDataService)
export class LearningDataService extends BaseService<LearningData> {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    /**
     * Gets base repository instance
     * @returns base repository instance
     */
    protected getBaseRepositoryInstance(): IRepository<LearningData> {
        return Container.get<ILearningDataRepository>(TYPES.LearningDataRepository);
    }

    /**
     * Gets by student
     * @param student Reference to a student or student id
     * @returns LearningData
     */
    async getByStudent(student: IDocumentReference | string): Promise<LearningData> {
        if (typeof student === 'string') {
            // eslint-disable-next-line no-param-reassign
            student = this.userRepository.getDocumentRef(student);
        }

        const [record] = (await this.findBy('student', student)) || [];

        return record;
    }

    /**
     * Gets learning data summary
     * @param tutorId ID of tutor uses to query the learning sessions
     * @returns ILearningDataSummary
     */
    async getLearningDataSummary(tutorId: string): Promise<ILearningDataSummary> {
        try {
            const data: LearningData = await this.getById(tutorId);

            return {
                upcoming: data.upcomingSession,
                completed: data.completedSession,
                missed: data.missedSession,
                totalHour: data.completedMinute / 60
            };
        } catch {
            return {};
        }
    }
}
