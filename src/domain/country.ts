import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type ICountry = {
    /**
     * Name  of country entity
     */
    name: string;

    /**
     * Code  of country entity
     */
    code: string;
};

/**
 * Country entity
 */
export type ICountryEntity = Required<ICountry> & domain.ITimstamp;

// Collection: countries
@injectable()
export default class Country extends Entity<ICountryEntity> {
    constructor(props: ICountryEntity, _id?: string) {
        super(props, _id);
    }
}
