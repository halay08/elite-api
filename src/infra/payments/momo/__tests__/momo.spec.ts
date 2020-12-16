import 'reflect-metadata';
import * as MockDate from 'mockdate';
import * as cuid from 'cuid';
import * as sinon from 'sinon';
import { Momo } from '../momo';
import { MomoFields, MomoIPNRequest } from '../types';

const constantsMock = require('@/api/http/config/constants');
const momo = new Momo();
const env = {
    momo: {
        PARTNER_CODE: 'MOMO',
        ACCESS_KEY: 'F8BBA842ECF85',
        SECRET_KEY: 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    }
};

const payload: Partial<MomoFields> = {
    requestId: 'MM1540456472575',
    amount: '150000',
    orderId: 'MM1540456472575',
    orderInfo: 'SDK team.',
    returnUrl: 'https://momo.vn',
    notifyUrl: 'https://momo.vn',
    extraData: 'email=abc@gmail.com'
};

const payloadIPN: MomoIPNRequest = {
    partnerCode: 'MOMOTUEN20190312',
    accessKey: 'ZjF6taKUohp7iN8l',
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
    extraData: 'Nothing',
    signature: 'e1da7982cdbc732c172e4f2909d6f70c5e2a5d2dde7e8c02dce866c6b35c9461',
    amount: '300000'
};

// Match with sample from Momo
const expectedSignature = '996ed81d68a1b05c99516835e404b2d0146d9b12fbcecbf80c7e51df51cac85e';

describe('#MOMO', () => {
    describe('#createSignature()', () => {
        beforeAll(() => {
            const sandbox = sinon.createSandbox();
            sandbox.stub(constantsMock, 'env').value(env);
        });

        afterAll(() => {
            sinon.restore();
        });

        it('should return correctly signature', async () => {
            expect((momo as any).createSignature(payload)).toEqual(expectedSignature);
        });

        it('should return incorrectly signature', async () => {
            expect((momo as any).createSignature({ ...payload, requestId: 'change-it' })).not.toEqual(
                expectedSignature
            );
        });
    });

    describe('#captureMoMoWallet()', () => {
        it('should return correctly response from Momo', async () => {
            payload.orderId = cuid();
            const { errorCode } = await (momo as any).captureMoMoWallet(payload);
            expect(errorCode).toEqual(0);
        });
    });

    describe('#getResponseTime()', () => {
        it('should return correctly response for Momo', () => {
            MockDate.set('2020-12-18 22:44:22');

            const responseTime = (momo as any).getResponseTime();
            expect(responseTime).toEqual('2020-12-18 22:44:22');

            MockDate.reset();
        });
    });

    describe('#ipnResponse()', () => {
        it('should return correctly response for Momo', async () => {
            const { errorCode } = await (momo as any).ipnResponse(payloadIPN);
            expect(errorCode).toEqual(0);
        });
    });
});
