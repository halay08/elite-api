import { injectable } from 'inversify';
import { Entity } from './entity';
import { ITutorWalletEntity } from './types';

@injectable()
export default class TutorWallet extends Entity<ITutorWalletEntity> {
    constructor(props: ITutorWalletEntity) {
        super(props);
    }
}
