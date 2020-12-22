import { provide } from 'inversify-binding-decorators';
import { Course } from '@/domain';
import { ICourseDetail } from '@/domain/types';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ICourseRepository, ITutorRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { inject } from 'inversify';
import { SessionService } from './session';

@provide(TYPES.CourseService)
export class CourseService extends BaseService<Course> {
    constructor(
        @inject(TYPES.SessionService) private sessionService: SessionService,
        @inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository
    ) {
        super();
    }
    /**
     * Create course repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Course> {
        return Container.get<ICourseRepository>(TYPES.CourseRepository);
    }

    /**
     * Find courses by tutor id.
     *
     * @param id The tutor id
     */
    async getCourseByTutor(id: string): Promise<Course[]> {
        const ref = this.tutorRepository.getDocumentRef(id);
        const courses = await this.baseRepository.query([{ tutor: ref }]);

        return courses;
    }

    /**
     * Find course detail by id.
     *
     * @param courseId The course id
     */
    async findDetailById(courseId: string): Promise<ICourseDetail | undefined> {
        const course = await this.getById(courseId);

        if (typeof course === 'undefined' || !course) {
            return;
        }
        const serialized = course.serialize();

        const sessions = await this.sessionService.getByCourses(serialized.id || '');
        const totalCost = sessions.reduce((acc, session) => {
            return acc + session.serialize().cost;
        }, 0);

        return { ...serialized, totalCost };
    }
}
