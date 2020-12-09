import { injectable } from 'inversify';
import { Entity } from './entity';
import { ITutorWalletTransactionEntity } from './types';

// Collection tutor_wallet_transaction
@injectable()
export class TutorWalletTransaction extends Entity<ITutorWalletTransactionEntity> {
    constructor(props: ITutorWalletTransactionEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWalletTransaction properties
     * @returns TutorWalletTransaction
     */
    public static create(props: ITutorWalletTransactionEntity): TutorWalletTransaction {
        const instance = new TutorWalletTransaction(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
