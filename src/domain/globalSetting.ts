import { injectable } from 'inversify';

import { Entity } from './entity';
import { IGlobalSetttingEntity } from './types';

// Collection: global_settings
@injectable()
export default class GlobalSettting extends Entity<IGlobalSetttingEntity> {
    constructor(props: IGlobalSetttingEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props GlobalSettting properties
     * @returns GlobalSettting
     */
    public static create(props: IGlobalSetttingEntity): GlobalSettting {
        const instance = new GlobalSettting(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
