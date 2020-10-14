import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { Entity } from './entity';

@ApiModel({
    description: 'User Model',
    name: 'User'
})
export class UserEntity {
    id?: string;

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
    constructor(props: UserEntity) {
        const { id } = props;
        super(props, id);
    }

    public static create(props: UserEntity): User {
        const instance = new User(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
