import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type IStudentWallet = {
    student: IDocumentReference;

    totalCoin?: number;
};

/**
 * Student wallet entity
 * TODO: This is the temporary model
 */
type IStudentWalletEntity = IEntity & IStudentWallet & ITimestamp;

export { IStudentWallet, IStudentWalletEntity };
