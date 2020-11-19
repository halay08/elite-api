import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserEntity, UserRole, UserStatus } from './types';

// Collection: users
@injectable()
export default class User extends Entity<IUserEntity> {
    constructor(props: IUserEntity) {
        super(props);
    }

    /**
     * Creates user entity
     * @param props User properties
     * @returns User
     */
    public static create(props: IUserEntity): User {
        const instance = new User(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get email(): string {
        return this.props.email || '';
    }

    get status(): UserStatus {
        return this.props.status || UserStatus.ACTIVE;
    }
}
