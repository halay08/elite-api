import { injectable } from 'inversify';

import { Entity } from './entity';
import { IPolicyEntity } from './types';

// Collection: policies
@injectable()
export class Policy extends Entity<IPolicyEntity> {
    constructor(props: IPolicyEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: IPolicyEntity): Policy {
        const instance = new Policy(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
