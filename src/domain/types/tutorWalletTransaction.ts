import { IEmbedUser, IEntity } from '.';

type IEmbedTutorWallet = Required<IEntity> & {
    tutor: IEmbedUser;
};

type ITutorWalletTransaction = {
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
type ITutorWalletTransactionEntity = IEntity & ITutorWalletTransaction;

export { ITutorWalletTransaction, ITutorWalletTransactionEntity };
