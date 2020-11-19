import { IFollowing, IEmbedUser, IEntity, ITimstamp } from '.';

type IStudent = {
    user: IEmbedUser;

    studyTitle?: string;

    studyPlace?: string;

    jobTitle?: string;

    jobPlace?: string;

    followings?: IFollowing[];
};

/**
 * Student entity
 */
type IStudentEntity = IEntity & IStudent & ITimstamp;

export { IStudent, IStudentEntity };
