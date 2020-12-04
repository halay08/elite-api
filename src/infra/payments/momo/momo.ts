import got from 'got';
import { injectable } from 'inversify';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { MomoFields, MomoCredentials, MomoWallet, MomoWalletResponse } from './types';
import { env, paymentConfig } from '@/api/http/config/constants';

@injectable()
export class Momo {
    private get businessCredentials(): MomoCredentials {
        const MOMO_PARTNER_CODE = env.momo.PARTNER_CODE;
        const MOMO_ACCESS_KEY = env.momo.ACCESS_KEY;

        return { partnerCode: MOMO_PARTNER_CODE, accessKey: MOMO_ACCESS_KEY };
    }

    /**
     * Create signature
     * @see https://developers.momo.vn/#/?id=ch%e1%bb%af-k%c3%bd-%c4%91i%e1%bb%87n-t%e1%bb%ad
     */
    private createSignature(payload: MomoFields): string {
        const MOMO_SECRET_KEY = env.momo.SECRET_KEY;

        const credentials: MomoCredentials = this.businessCredentials;
        const objectToQueryString = querystring.stringify({ ...credentials, ...payload }, '', '', {
            encodeURIComponent: querystring.unescape
        });

        return crypto.createHmac('sha256', MOMO_SECRET_KEY).update(objectToQueryString).digest('hex');
    }

    /**
     * Capture Momo wallet
     * @see https://developers.momo.vn/#/docs/aio/?id=ph%c6%b0%c6%a1ng-th%e1%bb%a9c-thanh-to%c3%a1n
     */
    public async captureMoMoWallet(payload: MomoFields): Promise<MomoWalletResponse> {
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
}
