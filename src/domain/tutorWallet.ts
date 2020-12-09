import { injectable } from 'inversify';
import { Entity } from './entity';
import { ITutorWalletEntity } from './types';

@injectable()
export class TutorWallet extends Entity<ITutorWalletEntity> {
    constructor(props: ITutorWalletEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: ITutorWalletEntity): TutorWallet {
        const instance = new TutorWallet(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
