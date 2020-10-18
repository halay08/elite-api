import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';
import { IEmbedUser } from './user';

type IFollowing = Required<domain.IObjectId> & {
    tutor: NonNullable<IEmbedUser>;
};

export type IStudent = {
    user: NonNullable<IEmbedUser>;

    studyTitle?: string;

    studyPlace?: string;

    jobTitle?: string;

    jobPlace?: string;

    followings?: IFollowing[];
};

/**
 * Student entity
 */
export type IStudentEntity = domain.IEntity & IStudent & domain.ITimstamp;

// Collection: students
@injectable()
export default class Student extends Entity<IStudentEntity> {
    constructor(props: IStudentEntity, _id?: string) {
        super(props, _id);
    }
}
