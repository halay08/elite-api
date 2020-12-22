import { injectable } from 'inversify';

import { Entity } from './entity';
import { ISessionStackEntity } from './types';

// Collection: learning_stacks
@injectable()
export class SessionStack extends Entity<ISessionStackEntity> {
    constructor(props: ISessionStackEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props SessionStack properties
     * @returns SessionStack
     */
    public static create(props: ISessionStackEntity): SessionStack {
        const instance = new SessionStack(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
