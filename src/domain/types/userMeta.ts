import { IMedia, IEntity } from '.';

enum CertificateStatus {
    VERIFIED = 'verified',
    PENDING = 'pending'
}

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
    status: CertificateStatus;
};

type IContract = {
    name: string;

    url: string;

    signature: string;

    description?: string;

    signed_date: string;

    updated_date?: string;
};

export { IEducationMedia, IEducation, IExpertise, ICertificate, IContract, CertificateStatus };
