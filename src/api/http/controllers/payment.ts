//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, interfaces, response, requestBody } from 'inversify-express-utils';

import TYPES from '@/src/types';
import { momoWalletDTO, validateCreateMomoWallet, validateMomoIPN } from '@/api/http/requests/payment';
import { functionLog } from '@/api/http/helpers';
import { PaymentService } from '@/app/services';
import { paymentConfig } from '@/api/http/config/constants';
import { Momo, MomoCaptureWallet, MomoWalletResponse, MomoIPNRequest } from '@/infra/payments/momo';
import { UserRole, PaymentProcessing } from '@/src/domain/types';
import { authorize } from '@/api/http/middlewares';

@controller(`/payments`)
export class PaymentController extends BaseHttpController implements interfaces.Controller {
    @inject(TYPES.PaymentByMomo) private paymentByMomo: Momo;
    @inject(TYPES.PaymentService) private paymentService: PaymentService;

    /**
     *
     * @api {POST} /payments/momo Create Momo wallet payment
     * @apiName Join people to a room
     * @apiGroup Payment
     * @apiVersion  1.0.0
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
    @httpPost('/momo', authorize({ roles: [UserRole.STUDENT, UserRole.ADMIN] }), validateCreateMomoWallet)
    public async momo(@requestBody() body: momoWalletDTO, @response() res: Response) {
        try {
            const payload: MomoCaptureWallet = {
                requestId: body.orderId,
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
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

    /**
     *
     * @api {POST} /payments/momo/ipn Momo Instant payment notification
     * @apiName Momo IPN
     * @apiGroup Payment
     * @apiVersion  1.0.0
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
     *   "requestId": "1555383430",
     *   "orderId": "1555383430",
     *   "orderInfo":" ",
     *   "orderType": "momo_wallet",
     *   "transId": "2302586804",
     *   "errorCode": 0,
     *   "message": "Success",
     *   "localMessage": "Th%C3%A0nh%20c%C3%B4ng",
     *   "payType": "qr",
     *   "responseTime": "2019-04-09%2014%3A53%3A38",
     *   "extraData": "{"sessionId":123}",
     *   "signature": "e1da7982cdbc732c172e4f2909d6f70c5e2a5d2dde7e8c02dce866c6b35c9461",
     *   "amount": "300000"
     * }
     *
     * @apiSuccess (200) {json} String token
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "partnerCode": "MOMO0BZ920200323",
     *     "accessKey": "jPOqN2LPcAGhiqWe",
     *     "requestId": "1555383430",
     *     "orderId": "1555383430",
     *     "responseTime": "2020-12-18 21:57:41",
     *     "extraData": "{"sessionId":123}",
     *     "signature": "e1da7982cdbc732c172e4f2909d6f70c5e2a5d2dde7e8c02dce866c6b35c9461"
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
    @httpPost('/momo/ipn', validateMomoIPN)
    public async momoIPN(@requestBody() payload: MomoIPNRequest, @response() res: Response) {
        try {
            functionLog('MOMO Incoming IPN');
            const ipnResponse = await this.paymentByMomo.handleIncomingIPN(payload);

            const data: PaymentProcessing = JSON.parse(payload.extraData);
            await this.paymentService.onSuccessTransaction({
                ...data,
                transactionId: payload.transId,
                orderId: ipnResponse.orderId,
                amount: payload.amount
            });

            return res.status(HttpStatus.OK).json(ipnResponse);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
