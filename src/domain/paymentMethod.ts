import { injectable } from 'inversify';

import { Entity } from './entity';
import { IPaymentMethodEntity } from './types';

// Collection: payment_method
@injectable()
export default class PaymentMethod extends Entity<IPaymentMethodEntity> {
    constructor(props: IPaymentMethodEntity) {
        super(props);
    }
}
