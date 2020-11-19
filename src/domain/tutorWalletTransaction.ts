import { injectable } from 'inversify';
import { Entity } from './entity';
import { ITutorWalletTransactionEntity } from './types';

// Collection tutor_wallet_transaction
@injectable()
export default class TutorWalletTransaction extends Entity<ITutorWalletTransactionEntity> {
    constructor(props: ITutorWalletTransactionEntity) {
        super(props);
    }
}
