import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { Entity } from './entity';

@ApiModel({
    description: 'Country Model',
    name: 'Country'
})
export class CountryEtity {
    @ApiModelProperty({
        description: 'Name of country',
        required: true
    })
    name: string;

    @ApiModelProperty({
        description: 'Country ISO code. Example: https://gist.github.com/kyranjamie/646386d5edc174e8b549111572897f81',
        required: true
    })
    code: string;

    @ApiModelProperty({
        description: 'Created time',
        required: true
    })
    createdAt: Date;

    @ApiModelProperty({
        description: 'Updated time. Optional'
    })
    updatedAt?: Date;

    @ApiModelProperty({
        description: 'Deleted time. Optional'
    })
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
