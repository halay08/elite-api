import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    interfaces,
    response,
    requestParam,
    queryParam
} from 'inversify-express-utils';
import TYPES from '@/src/types';
import { SessionService, CourseService } from '@/src/app/services';
import { authorize } from '@/api/http/middlewares';
import { ISessionQueryParam } from '../requests';
import { UserRole } from '@/src/domain/types';
import { mapUserRef } from '@/src/app/helpers';

// Required login
@controller(`/courses`, authorize({ roles: [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT] }))
export class CourseController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.SessionService) private sessionService: SessionService,
        @inject(TYPES.CourseService) private courseService: CourseService
    ) {
        super();
    }
    /**
     * Https get sessions by course id
     * Postman API document: https://elitework.postman.co
     * @param id
     * @param queries Query string to filter session.
     * @param res
     * @returns Response
     */
    @httpGet('/:id/sessions')
    public async getSessions(
        @requestParam('id') id: string,
        @queryParam() queries: ISessionQueryParam,
        @response() res: Response
    ) {
        try {
            const sessions = await this.sessionService.getByCourses(id, queries);

            return res.status(HttpStatus.OK).json(sessions.map((s) => s.serialize()));
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

    /**
     * Gets recommendation courses by elite tutors.
     * The elites are queried from aggregation data in teaching_data collection.
     * @param res Inversify response
     * @returns Response
     */
    @httpGet('/recommendations')
    async getRecommendations(@response() res: Response) {
        try {
            const courses = await this.courseService.getRecommendations();

            const data = courses.map((s) => {
                const entity = s.serialize();
                return mapUserRef(entity);
            });

            return res.status(HttpStatus.OK).json(data);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    }

    @httpGet('/:id')
    public async index(@requestParam('id') id: string, @response() res: Response) {
        try {
            const course = await this.courseService.getDetailById(id);
            return res.status(HttpStatus.OK).json(course);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
