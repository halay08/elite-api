// @ts-nocheck
// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
import * as sinon from 'sinon';
import * as bodyParser from 'body-parser';
import { Response } from 'express';
import {
    InversifyExpressServer,
    controller,
    httpGet,
    requestParam,
    httpDelete,
    httpPost,
    httpPut,
    response,
    requestBody
} from 'inversify-express-utils';
import { Container, injectable } from 'inversify';
import * as supertest from 'supertest';

const constantsMock = require('@/api/http/config/constants');
const env = {
    momo: {
        PARTNER_CODE: 'MOMO',
        ACCESS_KEY: 'F8BBA842ECF85',
        SECRET_KEY: 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    }
};
const payloadIPN: Partial<MomoIPNRequest> = {
    requestId: '1555383430',
    orderId: '1555383430',
    orderInfo: ' ',
    orderType: 'momo_wallet',
    transId: '2302586804',
    errorCode: 0,
    message: 'Success',
    localMessage: 'Th%C3%A0nh%20c%C3%B4ng',
    payType: 'qr',
    responseTime: '2019-04-09%2014%3A53%3A38',
    extraData: '{"sessionId":123}',
    signature: '96f6de1e0711dfefdc53007cf71d3a122fd8bee8587f37debe7d913ded05dceb',
    amount: '300000'
};

function getTestServer() {
    interface Movie {
        name: string;
    }

    const container = new Container();

    @controller('/api/v1/payments')
    class PaymentController {
        @httpPost('/momo/ipn')
        public ipn(@response() res: Response) {
            return res.status(200).json({ message: 'hello' });
        }
    }

    const app = new InversifyExpressServer(container);

    app.setConfig((a) => {
        a.use(bodyParser.json());
        a.use(bodyParser.urlencoded({ extended: true }));
    });

    const server = app.build();

    return server;
}

describe('Payment controller', () => {
    beforeAll(() => {
        const sandbox = sinon.createSandbox();
        sandbox.stub(constantsMock, 'env').value(env);
    });

    afterAll(() => {
        sinon.restore();
    });
    beforeEach((done) => {
        done();
    });

    it('Momo IPN should get correct response', async (done) => {
        const server = getTestServer();

        const res = await supertest(server)
            .post('/api/v1/payments/momo/ipn')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(payloadIPN);

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual('hello');

        done();
    });
});
