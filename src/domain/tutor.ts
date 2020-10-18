import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser, ICategory, IDocument } from '.';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace interfaces {
    type IEducationMedia = {
        url: NonNullable<string>;
    };

    type IEducation = {
        start_date: Date;

        end_date: Date;

        is_present_learning: boolean;

        school_name: string;

        media?: IEducationMedia[];

        location?: string;
    };

    type IExpertise = {
        name: string;

        level: string;
    };

    type ICertificate = {
        name: NonNullable<string>;

        url: string;

        description?: string;

        /**
         * Status: approved or not
         */
        status: NonNullable<boolean>;
    };

    type IContracts = {
        name: string;

        url: string;

        signature: string;

        description?: string;

        signed_date: string;

        updated_date?: string;
    };

    enum TutorStatus {
        INVISIBLE = 0,
        ACTIVE = 1,
        AWAY = 2,
        BUSY = 3
    }
}

export type ITutor = {
    user: NonNullable<IEmbedUser>;

    category: ICategory & domain.IObjectId;

    educations: interfaces.IEducation[];

    expertises: interfaces.IExpertise[];

    certificates: interfaces.ICertificate[];

    contracts?: interfaces.IContracts[];

    documents: (domain.IObjectId & IDocument)[];

    /**
     * Total of followers
     */
    followers?: NonNullable<number>;

    /**
     * Total of happy users
     */
    happyUsers?: NonNullable<number>;

    /**
     * Total of reviews
     */
    reviews?: NonNullable<number>;

    /**
     * The overwrite service fee
     */
    serviceFee?: NonNullable<number>;

    activeStatus: interfaces.TutorStatus;
};

/**
 * Tutor entity
 */
export type ITutorEntity = domain.IEntity & ITutor & domain.ITimstamp;

// Collection: tutors
@injectable()
export default class Tutor extends Entity<ITutorEntity> {
    constructor(props: ITutorEntity, _id?: string) {
        super(props, _id);
    }
}
