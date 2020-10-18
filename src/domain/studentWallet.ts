import { injectable } from 'inversify';
import { IEmbedUser, domain } from '.';
import { Entity } from './entity';

export type IStudentWallet = {
    student: NonNullable<IEmbedUser>;

    totalCoin?: number;
};

/**
 * Student wallet entity
 * TODO: This is the temporary model
 */
export type IStudentWalletEntity = domain.IEntity & IStudentWallet & domain.ITimstamp;

// Collection: student_wallet
@injectable()
export default class StudentWallet extends Entity<IStudentWalletEntity> {
    constructor(props: IStudentWalletEntity, _id?: string) {
        super(props, _id);
    }
}
