//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import got from 'got';
import { injectable } from 'inversify';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import {
    MomoCaptureWallet,
    MomoCredentials,
    MomoWallet,
    MomoWalletResponse,
    MomoIPNSignature,
    MomoIPNResponse,
    MomoIPNRequest
} from './types';
import { env, paymentConfig } from '@/api/http/config/constants';

@injectable()
export class Momo {
    private get businessCredentials(): MomoCredentials {
        const MOMO_PARTNER_CODE = env.momo.PARTNER_CODE;
        const MOMO_ACCESS_KEY = env.momo.ACCESS_KEY;

        return { partnerCode: MOMO_PARTNER_CODE, accessKey: MOMO_ACCESS_KEY };
    }

    /**
     * Create signature for capture wallet
     * @see https://developers.momo.vn/#/?id=ch%e1%bb%af-k%c3%bd-%c4%91i%e1%bb%87n-t%e1%bb%ad
     *
     * @private
     * @param {(MomoCaptureWallet | MomoIPNSignature)} payload
     * @returns {string}
     * @memberof Momo
     */
    private createSignature(payload: MomoCaptureWallet | MomoIPNSignature): string {
        const MOMO_SECRET_KEY = env.momo.SECRET_KEY;

        const credentials: MomoCredentials = this.businessCredentials;
        const objectToQueryString = querystring.stringify({ ...credentials, ...payload }, '', '', {
            encodeURIComponent: querystring.unescape
        });

        return crypto.createHmac('sha256', MOMO_SECRET_KEY).update(objectToQueryString).digest('hex');
    }

    /**
     * Verify signature when Momo send payload via IPN
     * @see https://developers.momo.vn/#/docs/aio/?id=ki%e1%bb%83m-tra-to%c3%a0n-v%e1%ba%b9n-d%e1%bb%af-li%e1%bb%87u
     *
     * @private
     * @param {string} momoSignature
     * @param {MomoIPNSignature} payload
     * @returns {boolean}
     * @memberof Momo
     */
    private verifySignature(momoSignature: string, payload: MomoIPNSignature): boolean {
        const ourGeneratedSignature = this.createSignature(payload);
        if (process.env.NODE_ENV === 'development') console.log(ourGeneratedSignature);
        return momoSignature === ourGeneratedSignature;
    }

    /**
     * Create format date yyyy-mm-dd HH:mm:ss
     * Required by Momo
     *
     * @private
     * @returns {string}
     * @memberof Momo
     */
    private getResponseTime(): string {
        const [mdy, time] = new Date()
            .toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
            .split(' ');

        const [month, day, year] = mdy.split('/');

        return parseInt(year) + '-' + parseInt(month) + '-' + parseInt(day) + ' ' + time;
    }

    /**
     * Capture Momo wallet
     * @see https://developers.momo.vn/#/docs/aio/?id=ph%c6%b0%c6%a1ng-th%e1%bb%a9c-thanh-to%c3%a1n
     *
     * @param {MomoCaptureWallet} payload
     * @returns {Promise<MomoWalletResponse>}
     * @memberof Momo
     */
    public async captureMoMoWallet(payload: MomoCaptureWallet): Promise<MomoWalletResponse> {
        const credentials: MomoCredentials = this.businessCredentials;
        const signature = this.createSignature(payload);
        const fullPayload: MomoWallet = {
            ...credentials,
            ...payload,
            requestType: 'captureMoMoWallet',
            signature: signature
        };

        const { body }: { body: MomoWalletResponse } = await got.post(paymentConfig.transactionURL, {
            json: fullPayload,
            responseType: 'json'
        });

        return body;
    }

    /**
     * Capture Momo Response for IPN
     * @see https://developers.momo.vn/#/docs/aio/?id=ph%c6%b0%c6%a1ng-th%e1%bb%a9c-thanh-to%c3%a1n
     *
     * @param {MomoIPNRequest} payload
     * @returns {Promise<MomoIPNResponse>}
     * @memberof Momo
     */
    public async handleIncomingIPN({
        requestId,
        orderId,
        errorCode,
        message,
        extraData,
        signature
    }: MomoIPNRequest): Promise<MomoIPNResponse> {
        if (errorCode !== 0) throw new Error('Transaction failed!');

        const credentials: MomoCredentials = this.businessCredentials;
        const responseTime = this.getResponseTime();

        const ipnPayloadForSignature: MomoIPNSignature = {
            ...credentials,
            ...{
                requestId,
                orderId,
                errorCode,
                message,
                extraData
            }
        };
        const isValidSignature: boolean = this.verifySignature(signature, ipnPayloadForSignature);

        if (!isValidSignature) throw new Error('Signature is not valid!');

        return { ...ipnPayloadForSignature, responseTime, signature: signature };
    }
}
