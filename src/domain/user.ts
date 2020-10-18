import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, ICountry, ILanguage, ICategory, IPolicy } from '.';

type IEmbedViolation = domain.IObjectId & {
    date: Date;
    policy: IPolicy;
};

export enum UserStatus {
    PENDING = 0,
    ACTIVE = 1,
    REJECT = 2,
    BANNED = 3
}

export enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    TEACHER = 'tutor'
}

export type IUserEntity = domain.IEntity &
    domain.ITimstamp & {
        /**
         * Id from firebase authentication
         */
        authId: string;

        role: UserRole;

        /**
         * Email  of user entity
         */
        email: NonNullable<string>;

        /**
         * Phone number of user entity
         */
        phoneNumber: NonNullable<string>;

        /**
         * Name  of user entity
         */
        name: string;

        /**
         * This will display on URL. Thus, it should be unique
         */
        username: string;

        surname?: string;

        avatar?: string;

        birthday?: Date;

        shortIntro?: string;

        videoIntro?: string;

        address?: string;

        timezone: string;

        country: ICountry & domain.IObjectId;

        language: ILanguage & domain.IObjectId;

        category?: (ICategory & domain.IObjectId)[];

        violations?: IEmbedViolation[];

        status: UserStatus;
    };

export type IEmbedUser = domain.IObjectId & Pick<IUserEntity, 'email' | 'phoneNumber' | 'name' | 'surname' | 'avatar'>;

// Collection: users
@injectable()
export default class User extends Entity<IUserEntity> {
    constructor(props: Partial<IUserEntity>, _id?: string) {
        super(props, _id);
    }
}
