import { IEmbedUser, IEntity } from '.';

type IEmbedStudentWallet = Required<IEntity> & {
    student: NonNullable<IEmbedUser>;
};

type IStudentWalletTransaction = {
    wallet: IEmbedStudentWallet;

    inAmount: number;

    outAmount: number;

    serviceFee: number;

    transactionDate: Date;
};

/**
 * Student wallet transaction entity
 * TODO: This is the temporary model
 */
type IStudentWalletTransactionEntity = IEntity & IStudentWalletTransaction;

export { IEmbedStudentWallet, IStudentWalletTransaction, IStudentWalletTransactionEntity };
