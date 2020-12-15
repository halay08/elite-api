import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type ITutorWallet = {
    tutor: IDocumentReference;

    totalAmount: number;

    /**
     * The amount after excluding service fee, tax
     */
    actualAmount: number;

    serviceFee?: number;
};

/**
 * Tutor wallet entity
 * TODO: This is the temporary model
 */
type ITutorWalletEntity = IEntity & ITutorWallet & ITimestamp;

export { ITutorWallet, ITutorWalletEntity };
