import { injectable } from 'inversify';
import { IEmbedUser, domain } from '.';
import { Entity } from './entity';

export type ITutorWallet = {
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
export type ITutorWalletEntity = domain.IEntity & ITutorWallet & domain.ITimstamp;

@injectable()
export default class TutorWallet extends Entity<ITutorWalletEntity> {
    constructor(props: ITutorWalletEntity, _id?: string) {
        super(props, _id);
    }
}
