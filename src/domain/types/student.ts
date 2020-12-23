import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type IStudent = {
    user: IDocumentReference;

    studyTitle?: string;

    studyPlace?: string;

    jobTitle?: string;

    jobPlace?: string;

    followings?: IDocumentReference[];
};

/**
 * Student entity
 */
type IStudentEntity = IEntity & IStudent & ITimestamp;

export { IStudent, IStudentEntity };
