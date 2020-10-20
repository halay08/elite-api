import { injectable } from 'inversify';
import { Entity } from './entity';
export class UserEntity {
    role: string;

    email: string;

    createdAt: string;
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
