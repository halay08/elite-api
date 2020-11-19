import { ICountry, ILanguage, ICategory, IPolicy, IEntity, ITimstamp } from '.';

type IEmbedViolation = Required<IEntity> & {
    date: Date;
    policy: IPolicy;
};

enum UserStatus {
    PENDING = 0,
    ACTIVE = 1,
    REJECT = 2,
    BANNED = 3
}

enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    TUTOR = 'tutor'
}

type IEmbedUser = Required<IEntity> & Pick<IUserEntity, 'email' | 'phoneNumber' | 'name' | 'surname' | 'avatar'>;

type IUserEntity = IEntity &
    ITimstamp & {
        role: UserRole;

        /**
         * Email  of user entity
         */
        email?: string;

        /**
         * Phone number of user entity
         */
        phoneNumber?: string;

        /**
         * Name  of user entity
         */
        name?: string;

        /**
         * This will display on URL. Thus, it should be unique
         */
        username?: string;

        surname?: string;

        avatar?: string;

        birthday?: Date;

        shortIntro?: string;

        videoIntro?: string;

        address?: string;

        timezone?: string;

        country?: ICountry & Required<IEntity>;

        language?: ILanguage & Required<IEntity>;

        category?: ICategory & Required<IEntity>;

        violations?: IEmbedViolation[];

        status: UserStatus;
    };

export { IEmbedViolation, UserStatus, UserRole, IEmbedUser, IUserEntity };
