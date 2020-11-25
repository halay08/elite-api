import { IFollowing, IEmbedUser, IEntity, ITimestamp } from '.';

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
type IStudentEntity = IEntity & IStudent & ITimestamp;

export { IStudent, IStudentEntity };
