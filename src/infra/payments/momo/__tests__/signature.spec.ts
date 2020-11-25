import 'reflect-metadata';
import * as sinon from 'sinon';
import { Momo } from '../momo';
import { Signature } from '../types';

const constantsMock = require('@/api/http/config/constants');
const momo = new Momo();
const env = {
    momo: {
        PARTNER_CODE: 'MOMO',
        ACCESS_KEY: 'F8BBA842ECF85',
        SECRET_KEY: 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    }
};
const payload: Partial<Signature> = {
    requestId: 'MM1540456472575',
    amount: 150000,
    orderId: 'MM1540456472575',
    orderInfo: 'SDK team.',
    returnUrl: 'https://momo.vn',
    notifyUrl: 'https://momo.vn',
    extraData: 'email=abc@gmail.com'
};

// Match with sample from Momo
const expectedSignature = '996ed81d68a1b05c99516835e404b2d0146d9b12fbcecbf80c7e51df51cac85e';

describe('#createSignature()', () => {
    beforeAll(() => {
        const sandbox = sinon.createSandbox();
        sandbox.stub(constantsMock, 'env').value(env);
    });

    afterAll(() => {
        sinon.restore();
    });

    it('should return correctly signature', async () => {
        expect(momo.createSignature(payload)).toEqual(expectedSignature);
    });

    it('should return incorrectly signature', async () => {
        expect(momo.createSignature({ ...payload, requestId: 'change-it' })).not.toEqual(expectedSignature);
    });
});
