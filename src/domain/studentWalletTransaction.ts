import { injectable } from 'inversify';
import { IEmbedUser, domain } from '.';
import { Entity } from './entity';

type IEmbedStudentWallet = Required<domain.IObjectId> & {
    student: NonNullable<IEmbedUser>;
};

export type IStudentWalletTransaction = {
    wallet: NonNullable<IEmbedStudentWallet>;

    in_amount: number;

    out_amount: number;

    service_fee: number;

    transaction_date: Date;
};

/**
 * Student wallet transaction entity
 * TODO: This is the temporary model
 */
export type IStudentWalletTransactionEntity = domain.IEntity & IStudentWalletTransaction;

// Collection: student_wallet_transaction
@injectable()
export default class StudentWalletTransaction extends Entity<IStudentWalletTransactionEntity> {
    constructor(props: IStudentWalletTransactionEntity, _id?: string) {
        super(props, _id);
    }
}
