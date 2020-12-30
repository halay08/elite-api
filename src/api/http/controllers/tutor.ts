import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    interfaces,
    response,
    queryParam,
    requestParam
} from 'inversify-express-utils';
import TYPES from '@/src/types';
import { ITutorQuery, ITutorReviewerQuery } from '../requests';
import { Tutor } from '@/src/domain';
import { UserRole, ITutorReviewerEntity } from '@/domain/types';
import { IQueryOption } from '@/infra/database/types';
import { getOperatorQueries } from '../helpers/tutor';
import { NotFoundError } from '@/app/errors/notFound';
import {
    TutorService,
    UserService,
    CourseService,
    LearningStackService,
    TutorReviewerService,
    TutorReviewerSummaryService
} from '@/src/app/services';
import { authorize } from '@/api/http/middlewares';
import { LIMIT } from '../config/pagination';
import { IPaginationResponse } from '../../types/pagination';
import { paginate } from '../helpers/paginator';

// Required login
@controller(`/tutors`, authorize({ roles: [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT] }))
export class TutorController extends BaseHttpController implements interfaces.Controller {
    @inject(TYPES.UserService) private userService: UserService;

    @inject(TYPES.TutorService) private tutorService: TutorService;

    @inject(TYPES.CourseService) private courseService: CourseService;

    @inject(TYPES.LearningStackService) private learningStackService: LearningStackService;

    @inject(TYPES.TutorReviewerService) private tutorReviewerService: TutorReviewerService;

    @inject(TYPES.TutorReviewerSummaryService) private tutorReviewerSummaryService: TutorReviewerSummaryService;

    @httpGet('/')
    public async index(@queryParam() queries: ITutorQuery, @response() res: Response) {
        try {
            const queryOption: Partial<IQueryOption<Tutor>> = {};
            // startTime will be implemented when we have course and session data.
            const { category, expertise, startTime, status, sort, lastDocumentId } = queries;
            if (sort) {
                queryOption.orderBy = Object.entries(sort).map(([field, order = 'asc']) => ({ field, order }));
            }

            queryOption.limit = LIMIT;

            if (lastDocumentId) {
                queryOption.startAfter = this.tutorService.getDocumentRef(lastDocumentId);
            }

            const operatorQueries = getOperatorQueries(queries);
            const items = await this.tutorService.query(operatorQueries, queryOption);
            const data = paginate(
                items.map((t) => t.serialize()),
                {
                    category,
                    expertise,
                    startTime,
                    status
                },
                queries.sort
            );

            return res.status(HttpStatus.OK).json(data);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

    /**
     *
     * Get info of tutor. No authentication required
     * Postman API document: https://elitework.postman.co
     */
    @httpGet('/:username')
    public async getBySlug(@requestParam('username') slug: string, @response() res: Response) {
        try {
            // Get user by username
            // It will be used to get tutor by user reference
            const [user] = await this.userService.findBy('username', slug);

            if (typeof user === 'undefined') {
                throw new NotFoundError('User not found');
            }

            const userEntity = user.serialize();
            const userRef = this.userService.getDocumentRef(userEntity.id || '');

            // Get tutor by user reference
            const [tutor] = await this.tutorService.findBy('user', userRef);

            if (typeof tutor === 'undefined') {
                throw new NotFoundError('Tutor not found');
            }

            // Get tutor teaching stack summary
            const tutorStackSummary = await this.learningStackService.getTutorStackSummary(tutor.id);

            const data = {
                info: tutor.serialize(),
                summary: tutorStackSummary
            };

            return res.status(HttpStatus.OK).json(data);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    /**
     * Https get course by tutor id
     * Postman API document: https://elitework.postman.co
     * @param id
     * @param res
     * @returns
     */
    @httpGet('/:id/courses')
    public async getCourses(@requestParam('id') id: string, @response() res: Response) {
        try {
            const courses = await this.courseService.getCourseByTutor(id);

            return res.status(HttpStatus.OK).json(courses.map((c) => c.serialize()));
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    /**
     * Https GET summary by tutor id
     * Postman API document: https://elitework.postman.co
     * @param id
     * @param res
     * @returns
     */
    @httpGet('/:id/summary')
    public async getSummary(@requestParam('id') id: string, @response() res: Response) {
        try {
            const courses = await this.courseService.getCourseByTutor(id);

            return res.status(HttpStatus.OK).json(courses.map((c) => c.serialize()));
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    @httpGet('/:id/reviews')
    public async getReviews(
        @requestParam('id') id: string,
        @queryParam() queries: ITutorReviewerQuery,
        @response() res: Response
    ) {
        try {
            // Tutor(user) id, also tutor summary id, they're same
            const reviewerSummary = await this.tutorReviewerSummaryService.getById(id);

            if (!reviewerSummary) {
                throw new NotFoundError('No review found');
            }

            // Get tutor info
            const tutor = await this.tutorService.getByUser(id);

            const { punctual = 0, organized = 0, engaging = 0, totalOfReviewer = 0 } = reviewerSummary;

            // Get list of reviews
            const { lastDocumentId } = queries;
            const reviewers = await this.tutorReviewerService.paginate(id, lastDocumentId, LIMIT);
            const reviewerPagination: IPaginationResponse<ITutorReviewerEntity> = paginate(
                reviewers.map((r) => r.serialize())
            );

            const data = {
                tutor: tutor.serialize(),
                summary: {
                    punctual: totalOfReviewer > 0 ? punctual / totalOfReviewer : 0,
                    organized: totalOfReviewer > 0 ? organized / totalOfReviewer : 0,
                    engaging: totalOfReviewer > 0 ? engaging / totalOfReviewer : 0
                },
                reviews: reviewerPagination
            };

            return res.status(HttpStatus.OK).json(data);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }
}
