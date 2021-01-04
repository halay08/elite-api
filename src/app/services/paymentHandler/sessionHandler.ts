import Container from '@/src/container';
import TYPES from '@/src/types';
import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { Session } from '@/domain';
import { SessionService } from '../index';

export class SessionHandler extends AbstractHandler<Session> {
    public handle({ name, data, id }: IPaymentRequestHandler<Session>): Promise<Session> {
        if (name === ChainOfEvents.SESSION_HANDLER) {
            const sessionService = Container.get<SessionService>(TYPES.SessionService);

            const updateSessionStatus = sessionService.update(id, data);

            return updateSessionStatus;
        }

        return super.handle({ name, data, id });
    }
}
