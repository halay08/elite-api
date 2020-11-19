import { IMedia, IEntity, IEmbedUser } from '.';

type IEducationMedia = Required<IEntity> & Pick<IMedia, 'name' | 'slug' | 'url' | 'metas'>;

type IEducation = {
    startDate: Date;

    endDate: Date;

    isPresentLearning: boolean;

    schoolName: string;

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

type IContract = {
    name: string;

    url: string;

    signature: string;

    description?: string;

    signed_date: string;

    updated_date?: string;
};

type IFollowing = Required<IEntity> & {
    tutor: IEmbedUser;
};

export { IEducationMedia, IEducation, IExpertise, ICertificate, IContract, IFollowing };
