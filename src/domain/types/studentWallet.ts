import { IEmbedUser, IEntity, ITimstamp } from '.';

type IStudentWallet = {
    student: NonNullable<IEmbedUser>;

    totalCoin?: number;
};

/**
 * Student wallet entity
 * TODO: This is the temporary model
 */
type IStudentWalletEntity = IEntity & IStudentWallet & ITimstamp;

export { IStudentWallet, IStudentWalletEntity };
