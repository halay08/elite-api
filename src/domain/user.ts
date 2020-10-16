import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { Entity } from './entity';

@ApiModel({
    description: 'User Model',
    name: 'User'
})
export class UserEntity {
    @ApiModelProperty({
        description: 'Email',
        required: true
    })
    email: string;

    @ApiModelProperty({
        description: 'Name',
        required: true
    })
    name: string;
}

@injectable()
export class User extends Entity<UserEntity> {
    constructor(props: UserEntity, _id?: string) {
        super(props, _id);
    }

    public static create(props: UserEntity, _id?: string): User {
        const instance = new User(props, _id);
        return instance;
    }
}
