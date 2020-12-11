import { injectable } from 'inversify';

import { Entity } from './entity';
import { I####Entity } from './types';

// Collection: booking
@injectable()
export default class #### extends Entity<I####Entity> {
    constructor(props: I####Entity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props #### properties
     * @returns ####
     */
    public static create(props: I####Entity): #### {
        const instance = new ####(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
