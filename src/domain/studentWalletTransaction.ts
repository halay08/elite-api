import { injectable } from 'inversify';
import { IStudentWalletTransactionEntity } from './types';
import { Entity } from './entity';

// Collection: student_wallet_transaction
@injectable()
export default class StudentWalletTransaction extends Entity<IStudentWalletTransactionEntity> {
    constructor(props: IStudentWalletTransactionEntity) {
        super(props);
    }
}
