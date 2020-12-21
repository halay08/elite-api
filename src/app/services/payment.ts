import { provide } from 'inversify-binding-decorators';
import * as nanoid from 'nanoid';
import { inject } from 'inversify';
import TYPES from '@/src/types';
import { Session } from '@/domain';
import { SessionService } from './index';
import { PaymentProcessing, SessionStatus } from '@/domain/types';

@provide(TYPES.PaymentService)
export class PaymentService {
    @inject(TYPES.SessionService) private readonly sessionService: SessionService;

    /**
     * Generate unique order id
     *
     * @returns string
     * @memberof PaymentService
     */
    public generateOrderId(): string {
        const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const orderId = nanoid.customAlphabet(alphabet, 10);
        return orderId();
    }

    /**
     * Handle the actions after verified that session booked successfully
     *
     * @param {PaymentProcessing} { sessionId }
     * @returns {Session}
     * @memberof PaymentService
     */
    public async onSuccessTransaction({ sessionId }: PaymentProcessing) {
        // Change session status to booked
        const session: Session = await this.sessionService.getById(sessionId.toString());

        const updated = await this.sessionService.update(
            sessionId,
            Session.create({ ...session.serialize(), status: SessionStatus.BOOKED })
        );
        return updated;
    }
}
