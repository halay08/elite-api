import { provide } from 'inversify-binding-decorators';

import { Course } from '@/domain';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ICourseRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { COLLECTIONS } from '@/src/infra/database/config/collection';

@provide(TYPES.CourseService)
export class CourseService extends BaseService<Course> {
    /**
     * Create course repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Course> {
        return Container.get<ICourseRepository>(TYPES.CourseRepository);
    }

    /**
     * Find courses by tutur id.
     *
     * @param id The tutor id
     */
    async getCourseByTutor(id: string): Promise<Course[]> {
        const ref = this.baseRepository.getDocumentRef(`${COLLECTIONS.Tutor}/${id}`);
        const courses = await this.baseRepository.query([{ tutor: ref }]);

        return courses;
    }
}
