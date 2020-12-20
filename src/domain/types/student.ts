import { IDocumentReference } from '@/src/infra/database/types';
import { IFollowing, IEntity, ITimestamp } from '.';

type IStudent = {
    user: IDocumentReference;

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
