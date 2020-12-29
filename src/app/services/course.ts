import { provide } from 'inversify-binding-decorators';
import { Course } from '@/domain';
import { ICourseDetail } from '@/domain/types';
import TYPES from '@/src/types';
import { BaseService } from './base';
import { IRepository, ICourseRepository } from '@/src/infra/database/repositories';
import Container from '@/src/container';
import { inject } from 'inversify';
import { TutorService, SessionService, UserService } from '.';
import { IQuery } from '@/infra/database/types';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.CourseService)
export class CourseService extends BaseService<Course> {
    @inject(TYPES.SessionService) private sessionService: SessionService;

    @inject(TYPES.TutorService) private readonly tutorService: TutorService;

    @inject(TYPES.UserService) private readonly userService: UserService;

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
        const ref = this.userService.getDocumentRef(id);
        const courses = await this.baseRepository.query([{ tutor: ref }]);

        return courses;
    }

    /**
     * Find course detail by id.
     *
     * @param courseId The course id
     */
    async getDetailById(courseId: string): Promise<ICourseDetail> {
        const courseEntity = await this.getById(courseId);

        if (typeof courseEntity === 'undefined' || !courseEntity) {
            throw new NotFoundError('Course not found');
        }
        const course = courseEntity.serialize();

        const sessions = await this.sessionService.getByCourses(course.id || '');
        const totalCost = sessions.reduce((acc, session) => {
            return acc + session.serialize().cost;
        }, 0);

        const tutorEntity = await this.tutorService.getById(course.tutor.id);
        const tutor = tutorEntity.serialize();

        return { ...course, tutor, totalCost };
    }

    /**
     * Gets recommendation courses by elite tutors.
     * The elites are queried from aggregation data in teaching_data collection.
     * @param [limit] Limit of courses
     * @returns Course[]
     */
    async getRecommendations(limit: number = 10): Promise<Course[]> {
        const queries: IQuery<Course>[] = [];
        const elites = await this.tutorService.getElites();

        if (!elites) {
            throw new NotFoundError('No elite found');
        }

        const refs = elites.map((t) => {
            return this.userService.getDocumentRef(t.user.id);
        });

        queries.push({
            tutor: refs,
            operator: 'in'
        });

        return this.query(queries, { limit });
    }
}
