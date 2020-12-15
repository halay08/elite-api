import { IEntity } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorWalletTransaction = {
    wallet: IDocumentReference;

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
