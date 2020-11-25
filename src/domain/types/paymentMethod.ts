import { IEntity, ITimestamp, IGlobalSettting } from '.';

enum PaymentMethodStatus {
    INACTIVE = 0,
    ACTIVE = 1
}

type IEmbedPaymentMethod = Required<IEntity> & Pick<IPaymentMethod, 'name' | 'configuration'>;

type IPaymentMethod = {
    name: string;

    configuration?: Pick<IGlobalSettting, 'name' | 'value'>;

    description: string;

    status: PaymentMethodStatus;
};

/**
 * Payment method entity
 */
type IPaymentMethodEntity = IEntity & IPaymentMethod & ITimestamp;

export { PaymentMethodStatus, IPaymentMethod, IPaymentMethodEntity, IEmbedPaymentMethod };
