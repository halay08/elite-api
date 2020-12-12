import { injectable } from 'inversify';
import { Entity } from './entity';
import { IStudentWalletEntity } from './types';

// Collection: student_wallet
@injectable()
export class StudentWallet extends Entity<IStudentWalletEntity> {
    constructor(props: IStudentWalletEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props StudentWallet properties
     * @returns StudentWallet
     */
    public static create(props: IStudentWalletEntity): StudentWallet {
        const instance = new StudentWallet(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
