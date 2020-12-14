import { inject } from 'inversify';
import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { fireauth } from '@/infra/auth/firebase/types';
import { BaseHttpController, controller, httpPost, interfaces, response, requestBody } from 'inversify-express-utils';
import { BookingService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { BookingDTO, bookingValidationMiddleWare } from '../requests';

@controller(`/booking`)
export class BookingController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.BookingService) private bookingService: BookingService) {
        super();
    }

    /**
     *
     * @api {POST} /booking Create booking
     * @apiGroup Booking
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiSuccess (200) {Object}
     * @apiSuccessExample {Object} Success-Response:
     * Ygfec8d3BfVk7E7OeDPm
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "something went wrong"
     *   }
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpPost('/', authorize({ roles: ['student'] }), bookingValidationMiddleWare)
    public async index(@requestBody() payload: BookingDTO, @response() res: Response) {
        try {
            const { user }: { user: fireauth.IUserRecord } = this.httpContext.user.details;

            const data = await this.bookingService.createBooking(payload, user);
            return res.status(HttpStatus.OK).end(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
