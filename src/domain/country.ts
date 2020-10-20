import { injectable } from 'inversify';

import { Entity } from './entity';

export class CountryEtity {
    name: string;

    code: string;

    createdAt: Date;

    updatedAt?: Date;

    deletedAt?: Date;
}

@injectable()
export class Country extends Entity<CountryEtity> {
    constructor(props: CountryEtity, _id?: string) {
        super(props, _id);
    }

    public static create(props: CountryEtity, _id?: string): Country {
        const instance = new Country(props, _id);
        return instance;
    }
}
