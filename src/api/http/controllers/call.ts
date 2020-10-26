import { Response } from 'express';
import { Joi, validate } from 'express-validation';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet, interfaces, requestParam, queryParam, response } from 'inversify-express-utils';

import { CallToken } from '@/domain/call';
import { Call } from '@/infra/call/twillio';
import TYPES from '@/src/types';
import { env } from '@/api/http/config/constants';

const Validation = {
    token: {
        params: Joi.object({
            user: Joi.string().required(),
            room: Joi.string().required()
        }),
        query: Joi.object({
            ttl: Joi.number().allow(null, '')
        })
    }
};

@controller(`/call`)
export class CallController implements interfaces.Controller {
    @inject(TYPES.Call) private call: Call;

    /**
     *
     * @api {GET} /call/token/:user/:room Get video call token
     * @apiName Get Token
     * @apiGroup Video Call
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     *     }
     *
     * @apiParam  {String} user Id of user
     * @apiParam  {String} room Room Id
     * @apiParam  {String} [ttl=3600] Time to live of token
     *
     * @apiParamExample  {type} Request-Example:
     * {
     *     user : 'Ygfec8d3BfVk7E7OeDPm'
     *     room : '7E7OeDPm'
     * }
     *
     * @apiSuccess (200) {json} String token
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *     token : '324kjhdsfjkhsk2'
     * }
     *
     * @apiError BAD_REQUEST Return Error Message.
     *
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "channel name is required"
     *   }
     *
     *
     */
    @httpGet('/token/:user/:room', validate(Validation.token))
    public async getToken(
        @requestParam('user') user: string,
        @requestParam('room') room: string,
        @queryParam('ttl') ttl: number,
        @response() res: Response
    ): Promise<CallToken | void> {
        try {
            const expiredIn = typeof ttl !== 'number' ? parseInt(env.twilio.TOKEN_TTL) : ttl;
            return this.call.getToken(user, room, expiredIn);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }).end();
        }
    }
}
