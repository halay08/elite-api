import { injectable } from 'inversify';

import { Entity } from './entity';
import { ICountryEntity } from './types';

// Collection: countries
@injectable()
export default class Country extends Entity<ICountryEntity> {
    constructor(props: ICountryEntity) {
        super(props);
    }
}
