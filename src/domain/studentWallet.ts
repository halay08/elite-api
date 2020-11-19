import { injectable } from 'inversify';
import { Entity } from './entity';
import { IStudentWalletEntity } from './types';

// Collection: student_wallet
@injectable()
export default class StudentWallet extends Entity<IStudentWalletEntity> {
    constructor(props: IStudentWalletEntity) {
        super(props);
    }
}
