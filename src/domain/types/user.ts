import { ICountry, ILanguage, ICategory, IPolicy, IEntity, ITimestamp } from '.';
import { IStudentEntity } from './student';
import { ITutorEntity } from './tutor';
import { IDocumentReference } from '@/src/infra/database/types';

type IEmbedViolation = Required<IEntity> & {
    date: Date;
    policy: IPolicy;
};

enum UserStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    REJECTED = 'rejected',
    BANNED = 'banned'
}

enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    TUTOR = 'tutor'
}

type IUserRelation = {
    tutors?: ITutorEntity[];

    students?: IStudentEntity[];
};

type IEmbedUser = Required<IEntity> & Pick<IUserEntity, 'email' | 'username' | 'name' | 'surname' | 'avatar'>;

type IUserEntity = IEntity &
    ITimestamp & {
        role?: UserRole;

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

        country?: ICountry;

        language?: ILanguage;

        category?: ICategory;

        violations?: IEmbedViolation[];

        status: UserStatus;

        // Tutor or student
        metadata?: IDocumentReference;
    };

export { IEmbedViolation, UserStatus, UserRole, IEmbedUser, IUserEntity, IUserRelation };
