import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    controller,
    httpGet,
    interfaces,
    queryParam,
    response
} from 'inversify-express-utils';
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant
} from 'swagger-express-ts';

import { apiVersion } from '@/api/http/config/constants'
import { CallToken } from '@/domain/call';
import { Call } from '@/infra/call/agora';

import TYPES from '@/src/types';

@ApiPath({
    path: `/api/${apiVersion}/call`,
    name: 'Version',
    security: { basicAuth: [] }
})
@controller(`/call`)
export class CallController implements interfaces.Controller {
    @inject(TYPES.Call) private call: Call

    @ApiOperationGet({
        description: 'Get Call Token',
        summary: 'Call Token',
        responses: {
            200: {
                description: 'Success',
                type: SwaggerDefinitionConstant.Response.Type.ARRAY,
                model: 'CallToken'
            }
        },
        security: {
            apiKeyHeader: []
        }
    })
    @httpGet('/')
    public async getToken(@queryParam('channelName') channelName: string,
                          @queryParam('expiredTime') expiredTime: number = 0, 
                          @queryParam('uid') uid: number = 0, 
                          @queryParam('role') role: string = '', 
                          @response() res: Response): Promise<CallToken | void> {
        try {
            if (!channelName) {
                res.status(400).json({ error: 'channel name is required' }).end();
            }
            return this.call.getToken(channelName, expiredTime, uid, role)
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }).end();
        }
    }

}
