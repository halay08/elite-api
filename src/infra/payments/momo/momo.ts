import { injectable } from 'inversify';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { Signature } from './types';
import { env } from '@/api/http/config/constants';

@injectable()
export class Momo {
    public createSignature(payload: Partial<Signature>): string {
        const MOMO_PARTNER_CODE = env.momo.PARTNER_CODE;
        const MOMO_ACCESS_KEY = env.momo.ACCESS_KEY;
        const MOMO_SECRET_KEY = env.momo.SECRET_KEY;

        const credentials: Partial<Signature> = { partnerCode: MOMO_PARTNER_CODE, accessKey: MOMO_ACCESS_KEY };
        const objectToQueryString = querystring.stringify({ ...credentials, ...payload }, '', '', {
            encodeURIComponent: querystring.unescape
        });

        return crypto.createHmac('sha256', MOMO_SECRET_KEY).update(objectToQueryString).digest('hex');
    }
}
