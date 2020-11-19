import { IEntity, ITimstamp, IEmbedUser, ICategory, IEducation, IExpertise, ICertificate, IContract } from '.';

enum TutorStatus {
    INVISIBLE = 0,
    ACTIVE = 1,
    AWAY = 2,
    BUSY = 3
}

type ITutor = {
    user: NonNullable<IEmbedUser>;

    category: ICategory & Required<IEntity>;

    educations: IEducation[];

    expertises: IExpertise[];

    certificates: ICertificate[];

    contracts?: IContract[];

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

    activeStatus: TutorStatus;
};

/**
 * Tutor entity
 */
type ITutorEntity = IEntity & ITutor & ITimstamp;

export { TutorStatus, ITutor, ITutorEntity };
