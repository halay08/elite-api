import { injectable } from 'inversify';

import { Entity } from './entity';
import { IPaymentMethodEntity } from './types';

// Collection: payment_method
@injectable()
export class PaymentMethod extends Entity<IPaymentMethodEntity> {
    constructor(props: IPaymentMethodEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: IPaymentMethodEntity): PaymentMethod {
        const instance = new PaymentMethod(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
