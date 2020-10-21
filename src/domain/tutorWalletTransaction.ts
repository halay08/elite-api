import { injectable } from 'inversify';
import { IEmbedUser, domain } from '.';
import { Entity } from './entity';

type IEmbedTutorWallet = domain.IObjectId & {
    tutor: IEmbedUser;
};

export type ITutorWalletTransaction = {
    wallet: NonNullable<IEmbedTutorWallet>;

    in_amount: number;

    out_amount: number;

    service_fee?: number;

    transaction_date: Date;
};

/**
 * Student wallet transaction entity
 * TODO: This is the temporary model
 */
export type ITutorWalletTransactionEntity = ITutorWalletTransaction;

// Collection tutor_wallet_transaction
@injectable()
export default class TutorWalletTransaction extends Entity<ITutorWalletTransactionEntity> {
    constructor(props: ITutorWalletTransactionEntity, _id?: string) {
        super(props, _id);
    }
}
