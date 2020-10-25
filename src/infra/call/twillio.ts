import { injectable } from 'inversify';
import * as twilio from 'twilio';
import { CallToken } from '@/domain/call';
import { env } from '@/api/http/config/constants';

const TWILIO_ACCOUNT_SID = env.twilio.ACCOUNT_SID;
const TWILIO_API_KEY = env.twilio.API_KEY;
const TWILIO_API_SECRET = env.twilio.API_SECRET;

@injectable()
export class Call {
    public getToken(user: string, room: string, ttl?: number): CallToken {
        const AccessToken = twilio.jwt.AccessToken;
        const VideoGrant = AccessToken.VideoGrant;

        const token: any = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET);
        token.addGrant(new VideoGrant({ room }));
        token.identity = user;
        token.ttl = ttl;

        return { token: token.toJwt() };
    }
}
