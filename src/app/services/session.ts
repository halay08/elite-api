import { provide } from 'inversify-binding-decorators';
import { Session } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ISessionRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { COLLECTIONS } from '@/src/infra/database/config/collection';
import { ISessionQueryParam } from '../types';
import { IQuery } from '@/src/infra/database/types';
import * as dayjs from 'dayjs';

@provide(TYPES.SessionService)
export class SessionService extends BaseService<Session> {
    /**
     * Create session repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Session> {
        return Container.get<ISessionRepository>(TYPES.SessionRepository);
    }

    /**
     * Find sessions by course id.
     *
     * @param id The course id
     */
    async getByCourses(courseId: string, params: ISessionQueryParam = {}): Promise<Session[]> {
        const ref = this.baseRepository.getDocumentRef(`${COLLECTIONS.Course}/${courseId}`);
        const queries: IQuery<Session>[] = [
            {
                course: ref
            }
        ];

        const { from, to } = params;

        if (from) {
            queries.push({
                startTime: dayjs(from).toDate(),
                operator: '>='
            });
        }

        if (to) {
            queries.push({
                startTime: dayjs(to).toDate(),
                operator: '<='
            });
        }

        const sessions = await this.baseRepository.query(queries);

        return sessions;
    }
}
