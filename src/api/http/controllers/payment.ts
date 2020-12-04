import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces, response, requestBody } from 'inversify-express-utils';

import TYPES from '@/src/types';
import { createTransaction, validateMomoTransaction } from '@/api/http/requests/payment';
import { paymentConfig } from '@/api/http/config/constants';
import { Momo, MomoFields, MomoWalletResponse } from '@/infra/payments/momo';
import { authorize } from '@/api/http/middlewares';

@controller(`/payments`)
export class PaymentController extends BaseHttpController implements interfaces.Controller {
    @inject(TYPES.PaymentByMomo) private paymentByMomo: Momo;

    /**
     *
     * @api {POST} /payments/momo Create Momo wallet payment
     * @apiName Join people to a room
     * @apiGroup Payment
     * @apiVersion  1.0.0
     * @apiCurl http POST --auth-type=jwt --auth="$TOKEN" http://localhost:5001/elites-work-staging/asia-east2/api/v1/payments/momo requestId="123" amount="10000" orderId="123" orderInfo="Buy me a coffee" extraData="Here you go"
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "Bearer: dsfsdkfhjks2904820493204930-sdflskjd"
     * }
     *
     * @apiParam  {String} requestId Reqeuest Id
     * @apiParam  {String} amount Amount to pay
     * @apiParam  {String} orderId Order Id
     * @apiParam  {String} orderInfo Information about the order
     * @apiParam  {String} extraData Extra information
     *
     * @apiParamExample  {type} Request-Example:
     * {
     *   requestId: '123',
     *   amount: '10000',
     *   orderId: '123',
     *   orderInfo: 'Buy me a coffee',
     *   extraData: 'Here you go'
     * }
     *
     * @apiSuccess (200) {json} String token
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *  "errorCode": 0,
     *  "localMessage": "Thành công",
     *  "message": "Success",
     *  "orderId": "123",
     *  "payUrl": "https://test-payment.momo.vn/gw_payment/payment/qr?partnerCode=MOMO0BZ920200928&accessKey=jPOqN2LPcAGhigwF&requestId=123&amount=10000&orderId=123&signature=5e900886b9739e7f09f7bb484cec5bc8613fc6a3b88dd1edd572a2ccfb7ebe95&requestType=captureMoMoWallet",
     *  "requestId": "123",
     *  "requestType": "captureMoMoWallet",
     *  "signature": "0e412589adefd02df99ed9747f5985c68eed0540723fa844bdb79d1a4a3a0883"
     * }
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
    @httpPost('/momo', authorize({ roles: ['student'] }), validateMomoTransaction)
    public async momo(@requestBody() body: createTransaction, @response() res: Response) {
        try {
            const payload: MomoFields = {
                requestId: body.requestId,
                amount: body.amount,
                orderId: body.orderId,
                orderInfo: body.orderInfo,
                returnUrl: paymentConfig.returnUrl,
                notifyUrl: paymentConfig.notifyUrl,
                extraData: body.extraData
            };
            const data: MomoWalletResponse = await this.paymentByMomo.captureMoMoWallet(payload);
            const httpStatus = data.errorCode === 0 ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;

            return res.status(httpStatus).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error).end();
        }
    }
}
