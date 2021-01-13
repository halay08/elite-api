import { fireauth } from '@/infra/auth/firebase/types';
import { Response } from 'express';
import { Joi, validate } from 'express-validation';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPut,
    interfaces,
    requestParam,
    queryParam,
    response
} from 'inversify-express-utils';

import { env } from '@/api/http/config/constants';
import TYPES from '@/src/types';
import { Twilio as Call } from '@/infra/call/twillio';
import { UserRole, RoomStatus, LearningStatus } from '@/src/domain/types';
import { authorize } from '@/api/http/middlewares';
import { RoomService, LearningStackService } from '@/src/app/services';

const Validation = {
    token: {
        query: Joi.object({
            identity: Joi.string().required(),
            roomName: Joi.string().required(),
            ttl: Joi.number().allow(null, '')
        })
    }
};

@controller(`/call`, authorize({ roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR] }))
export class CallController extends BaseHttpController implements interfaces.Controller {
    @inject(TYPES.Call) private call: Call;
    @inject(TYPES.RoomService) private roomService: RoomService;
    @inject(TYPES.LearningStackService) private learningStackService: LearningStackService;

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
    @httpGet('/token', validate(Validation.token))
    public async getToken(
        @queryParam('identity') identity: string,
        @queryParam('roomName') roomName: string,
        @queryParam('ttl') ttl: number,
        @response() res: Response
    ) {
        try {
            const expiredIn = typeof ttl !== 'number' ? parseInt(env.twilio.TOKEN_TTL) : ttl;
            const token = this.call.getToken(identity, roomName, expiredIn);

            return res.status(HttpStatus.OK).json(token).end();
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }).end();
        }
    }

    /**
     *
     * @api {GET} /call/verify/:roomName?startAt=timestamp Get video call token
     * @apiName Verify people in room
     * @apiGroup Call
     * @apiVersion  1.0.0
     * @apiCurl curl -XGET -i -H"Content-Type: application/json" -H "Authorization: Bearer $TOKEN" http://localhost:5001/elites-work-staging/asia-east2/api/v1/call/verify/cki1iqmh20000bz0iff1dciza
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     *     }
     *
     * @apiParam  {String} roomName Id of course was created by teacher
     *
     * @apiParamExample  {type} Request-Example:
     * {
     *     roomName : 'Ygfec8d3BfVk7E7OeDPm'
     * }
     *
     * @apiSuccess (200) {json} String token
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *     allow : true
     * }
     *
     * @apiError BAD_REQUEST Return Error Message.
     *
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "roomName is required"
     *   }
     *
     *
     */
    @httpGet('/verify/:roomName')
    public async verify(@requestParam('roomName') roomName: string, @response() res: Response) {
        try {
            const { user }: { user: fireauth.IUserRecord } = this.httpContext.user.details;

            const data = await this.roomService.findByRoomName(roomName);
            const roomData = data.serialize();

            return res.status(HttpStatus.OK).json({
                allow: roomData.studentId === user.uid || roomData.tutorId === user.uid
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }).end();
        }
    }

    /**
     *
     * @api {PUT} /students/:id Update student
     * @apiGroup Student
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiParam  {String} Room Id
     *
     * @apiSuccess (200) {Object} New data updated
     * @apiSuccessExample {Object} Success-Response:
     * {
     *      "NIBPpAj9"
     *  }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpPut('/finish/:roomName')
    public async finishClass(@requestParam('roomName') roomName: string, @response() res: Response) {
        try {
            const room = await this.roomService.findByRoomName(roomName);
            const { id: roomId } = room.serialize();

            const learningStack = await this.learningStackService.getByOrderId(roomName);
            const { id: learningStackId } = learningStack.serialize();

            const updateRoom = this.roomService.update(roomId as string, { status: RoomStatus.NOT_READY });
            const updateLearningStack = this.learningStackService.update(learningStackId as string, {
                status: LearningStatus.COMPLETED
            });

            await Promise.all([updateRoom, updateLearningStack]);
            return res.status(HttpStatus.OK).json(roomId);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
