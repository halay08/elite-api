import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserEntity, UserRole, ICountry, ILanguage, ICategory, IEmbedViolation, UserStatus } from './types';

// Collection: users
@injectable()
export class User extends Entity<IUserEntity> {
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
        return this._props.id || '';
    }

    get role(): UserRole {
        return this.props.role;
    }

    /**
     * Email  of user entity
     */
    get email(): string {
        return this.props.email || '';
    }

    /**
     * Phone number of user entity
     */
    get phoneNumber(): string {
        return this.props.phoneNumber || '';
    }

    /**
     * Name  of user entity
     */
    get name(): string {
        return this.props.name || '';
    }

    /**
     * This will display on URL. Thus, it should be unique
     */
    get username(): string {
        return this.props.username || '';
    }

    get surname(): string {
        return this.props.surname || '';
    }

    get avatar(): string {
        return this.props.avatar || '';
    }

    get birthday(): Date {
        return this.props.birthday || (null as any);
    }

    get shortIntro(): string {
        return this.props.shortIntro || '';
    }

    get videoIntro(): string {
        return this.props.videoIntro || '';
    }

    get address(): string {
        return this.props.address || '';
    }

    get timezone(): string {
        return this.props.timezone || '';
    }

    get country(): ICountry {
        return this.props.country || (null as any);
    }

    get language(): ILanguage {
        return this.props.language || (null as any);
    }

    get category(): ICategory {
        return this.props.category || (null as any);
    }

    get violations(): IEmbedViolation[] {
        return this.props.violations || ([] as any);
    }

    get status(): UserStatus {
        return this.props.status;
    }
}
