import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

type IConfiguration = {
    key: string;

    value: string;
};

export enum PaymentMethodStatus {
    INACTIVE = 0,
    ACTIVE = 1
}

export type IPaymentMethod = {
    name: string;

    configuration?: IConfiguration;

    description: string;

    status: PaymentMethodStatus;
};

/**
 * Payment method entity
 */
export type IPaymentMethodEntity = domain.IEntity & IPaymentMethod & domain.ITimstamp;

// Collection: payment_method
@injectable()
export default class PaymentMethod extends Entity<IPaymentMethodEntity> {
    constructor(props: IPaymentMethod, _id?: string) {
        super(props, _id);
    }
}
