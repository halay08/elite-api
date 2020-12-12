import { injectable } from 'inversify';

import { Entity } from './entity';
import { ISessionEntity } from './types';

@injectable()
export class Session extends Entity<ISessionEntity> {
    constructor(props: ISessionEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Session properties
     * @returns Session
     */
    public static create(props: ISessionEntity): Session {
        const instance = new Session(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
