import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    response,
    requestBody,
    interfaces
} from 'inversify-express-utils';
import { ####Service } from '@/src/app/services';
import TYPES from '@/src/types';
import { ####DTO, FFFFValidationMiddleWare } from '../requests';
import { #### } from '@/src/domain';

@controller(`/FFFFs`)
export class ####Controller extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.####Service) private FFFFService: ####Service) {
        super();
    }

    /**
     *
     * @api {GET} /FFFFs Get list of FFFFs. No authentication required
     * @apiGroup ####
     * @apiVersion  1.0.0
     *
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     * }    
     * 
     * @apiSuccess (200) {Array} List of FFFFs
     * @apiSuccessExample {Array} Success-Response:
     * [
     *   {
     *      "_id": "Ygfec8d3BfVk7E7OeDPm",
     *      "FFFF": {
     *          "id": "yZGFDF6fGC3DdfgLgh69",
     *      }
     *   }
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
    public async index(@response() res: Response) {
        try {
            const data = await this.FFFFService.getAll();

            return res.status(HttpStatus.OK).json(data.map((u) => u.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    /**
     *
     * @api {POST} /FFFFs Create a new FFFF
     * @apiGroup ####
     * @apiVersion  1.0.0
     *
     * @apiParam  {String} name name of FFFF
     *
     * @apiSuccess (200) {Object} Valid event
     * @apiSuccessExample {Object} Success-Response:
     * {
     *   "created": true
     * }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     * Error 400: Bad Request
     * {
     *    "error": "Something went wrong"
     * }
     */
    @httpPost('/', FFFFValidationMiddleWare)
    public async create(@requestBody() req: ####DTO, @response() res: Response) {
        try {
            const FFFF = ####.create({
                name: req.name
            });
            const data = await this.FFFFService.create(FFFF);

            return res.status(HttpStatus.CREATED).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
