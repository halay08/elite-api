import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces, response, requestParam } from 'inversify-express-utils';
import TYPES from '@/src/types';
import { SessionService } from '@/src/app/services';
import { authorize } from '@/api/http/middlewares';

// Required login
@controller(`/courses`, authorize({ roles: ['admin', 'student', 'tutor'] }))
export class CourseController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.SessionService) private sessionService: SessionService) {
        super();
    }
    /**
     * Https get sessions by course id
     * Postman API document: https://elitework.postman.co
     * @param id
     * @param res
     * @returns
     */
    @httpGet('/:id/sessions')
    public async getSessions(@requestParam('id') id: string, @response() res: Response) {
        try {
            const sessions = await this.sessionService.getByCourses(id);

            return res.status(HttpStatus.OK).json(sessions.map((s) => s.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error });
        }
    }
}
