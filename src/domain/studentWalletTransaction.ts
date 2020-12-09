import { injectable } from 'inversify';
import { IStudentWalletTransactionEntity } from './types';
import { Entity } from './entity';

// Collection: student_wallet_transaction
@injectable()
export class StudentWalletTransaction extends Entity<IStudentWalletTransactionEntity> {
    constructor(props: IStudentWalletTransactionEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props StudentWalletTransaction properties
     * @returns StudentWalletTransaction
     */
    public static create(props: IStudentWalletTransactionEntity): StudentWalletTransaction {
        const instance = new StudentWalletTransaction(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
