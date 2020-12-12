import { injectable } from 'inversify';

import { Entity } from './entity';
import { ICountryEntity } from './types';

// Collection: countries
@injectable()
export class Country extends Entity<ICountryEntity> {
    constructor(props: ICountryEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Country properties
     * @returns Country
     */
    public static create(props: ICountryEntity): Country {
        const instance = new Country(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
