import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, response, interfaces, queryParam } from 'inversify-express-utils';
import { LearningStackService } from '@/src/app/services';
import TYPES from '@/src/types';
import { ILearningStackRequest } from '../requests/learningStack';
import { fireauth } from '@/infra/auth/firebase/types';
import { authorize } from '@/api/http/middlewares';
import { validateGet } from '../helpers/learningStack';

@controller(`/learning-stacks`, authorize({ roles: ['admin', 'student', 'tutor'] }))
export class LearningStackController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.LearningStackService) private learningStackService: LearningStackService) {
        super();
    }

    /**
     *
     * @api {GET} /learningStacks Get list of learningStacks
     * @apiGroup LearningStack
     * @apiVersion  1.0.0
     *
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     * }
     *
     * @apiSuccess (200) {Array} List of learningStacks
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "something went wrong"
     *   }
     */
    @httpGet('/', validateGet)
    public async index(@queryParam() queries: ILearningStackRequest, @response() res: Response) {
        try {
            const { user }: { user: fireauth.IUserRecord } = this.httpContext.user.details;
            const { uid } = user;
            const status = queries.status || '';
            const startAfter = queries.startAfter || '';
            const limit = queries.limit ? parseInt(queries.limit) : 0;

            const data = await this.learningStackService.getByStudentId({ uid, status, startAfter, limit });

            return res.status(HttpStatus.OK).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
