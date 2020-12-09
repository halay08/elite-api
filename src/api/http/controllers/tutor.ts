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
import { ITutorQuery } from '../requests';
import { Tutor } from '@/src/domain';
import { IQueryOption } from '@/infra/database/types';
import { Paginator } from '../helpers/paginator';
import { getOperatorQueries } from '../helpers/tutor';
import { NotFoundError } from '@/app/errors/notFound';
import { TutorService, UserService, CourseService } from '@/src/app/services';
import { authorize } from '@/api/http/middlewares';

// Required login
@controller(`/tutors`, authorize({ roles: ['admin', 'student', 'tutor'] }))
export class TutorController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.TutorService) private tutorService: TutorService,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.CourseService) private courseService: CourseService
    ) {
        super();
    }

    /**
     *
     * @api {GET} /tutors Get list of tutors. No authentication required
     * @apiGroup Tutor
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {Array} List of tutors
     * @apiSuccessExample {Array} Success-Response:
     * [
     *      {
     *          "_id": "Ygfec8d3BfVk7E7OeDPm",
     *          "user": {
     *              "id": "yZGFDF6fGC3DdfgLgh69",
     *              "email": "test@example.com"
     *          },
     *          "category": {
     *              "id": "z6N89Oisw3ojJHGF23FS",
     *              "name": "English"
     *          },
     *          "status": "online"
     *      }
     * ]
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "something went wrong"
     *   }
     */
    @httpGet('/')
    public async index(@queryParam() queries: ITutorQuery, @response() res: Response) {
        try {
            const queryOption: Partial<IQueryOption<Tutor>> = {};
            // startTime will be implemented when we have course and session data.
            const { page = 1, category, expertise, startTime, status } = queries;

            const pagination = new Paginator(page).get();
            queryOption.limit = pagination.limit;
            queryOption.startAt = pagination.offset;

            const operatorQueries = getOperatorQueries(queries);
            const items = await this.tutorService.query(operatorQueries, queryOption);
            const data = {
                pagination: {
                    currentPage: page,
                    nextPage: page + 1,
                    totalItemOfPage: items.length
                },
                filter: {
                    category,
                    expertise,
                    startTime,
                    status
                },
                sort: queries.sort,
                items: items.map((t) => t.serialize())
            };

            return res.status(HttpStatus.OK).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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
            const userRef = this.tutorService.getDocumentRef(`users/${userEntity.id}`);

            // Get tutor by user reference
            const [tutor] = await this.tutorService.findBy('user', userRef);

            if (typeof tutor === 'undefined') {
                throw new NotFoundError('Tutor not found');
            }

            return res.status(HttpStatus.OK).json(tutor.serialize());
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error });
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
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error });
        }
    }
}
