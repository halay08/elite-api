import { injectable } from 'inversify';
import * as functions from 'firebase-functions';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { CallToken } from '@/domain/call';

const defaultExpiredTime = 3600;
const appId = functions.config().env.agora.app_id;
const appCertificate = functions.config().env.agora.app_certificate;

@injectable()
export class Call {
    get config() {
        return { appId, appCertificate };
    }

    public getToken(channelName: string, expiredTime?: number, uid?: number, role?: string): CallToken {
        const expired = !expiredTime ? defaultExpiredTime : expiredTime;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expired;

        // use 0 if uid is not specified
        const userId = uid || 0;
        const selectedRole = role === 'publisher' || role === '' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            userId,
            selectedRole,
            privilegeExpiredTs
        );

        return { token };
    }
}
