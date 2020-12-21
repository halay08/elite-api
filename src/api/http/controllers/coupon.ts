import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, response, requestBody, interfaces } from 'inversify-express-utils';
import { CouponService } from '@/src/app/services';
import TYPES from '@/src/types';
import { CouponDTO, couponValidationMiddleWare } from '../requests';
import { Coupon } from '@/src/domain';
import { CouponStatus, UserRole } from '@/src/domain/types';
import { authorize } from '@/api/http/middlewares';

@controller(`/coupons`)
export class CouponController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.CouponService) private couponService: CouponService) {
        super();
    }

    /**
     *
     * @api {POST} /coupons Create a new coupon
     * @apiGroup Coupon
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     * }
     *
     * @apiParam  {String} name name of coupon
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
    @httpPost('/', authorize({ roles: [UserRole.ADMIN] }), couponValidationMiddleWare)
    public async create(@requestBody() req: CouponDTO, @response() res: Response) {
        try {
            const coupon = Coupon.create({
                code: req.code,
                status: CouponStatus.ACTIVE
            });
            const data = await this.couponService.create(coupon);

            return res.status(HttpStatus.CREATED).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
