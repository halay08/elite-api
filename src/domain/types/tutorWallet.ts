import { IEmbedUser, IEntity, ITimestamp } from '.';

type ITutorWallet = {
    tutor: NonNullable<IEmbedUser>;

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
