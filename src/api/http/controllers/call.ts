import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet, interfaces, queryParam, response } from 'inversify-express-utils';

// import { apiVersion } from '@/api/http/config/constants';
import { CallToken } from '@/domain/call';
import { Call } from '@/infra/call/agora';

import TYPES from '@/src/types';

@controller(`/call`)
export class CallController implements interfaces.Controller {
    @inject(TYPES.Call) private call: Call;

    /**
     *
     * @api {GET} /call Get video call token
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
     * @apiParam  {String} channelName name of channel to join
     * @apiParam  {Number} [expiredTime] Expiration time
     * @apiParam  {Number} [uid] Agora user id
     * @apiParam  {String} [role] Agora role
     *
     * @apiParamExample  {type} Request-Example:
     * {
     *     channelName : 'hello'
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
    @httpGet('/')
    public async getToken(
        @queryParam('channelName') channelName: string,
        @queryParam('expiredTime') expiredTime: number = 0,
        @queryParam('uid') uid: number = 0,
        @queryParam('role') role: string = '',
        @response() res: Response
    ): Promise<CallToken | void> {
        try {
            if (!channelName) {
                res.status(400).json({ error: 'channel name is required' }).end();
            }
            return this.call.getToken(channelName, expiredTime, uid, role);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }).end();
        }
    }
}
