import { injectable } from 'inversify';

import { Entity } from './entity';
import { IStudentEntity } from './types';

// Collection: students
@injectable()
export default class Student extends Entity<IStudentEntity> {
    constructor(props: IStudentEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Student properties
     * @returns Student
     */
    public static create(props: IStudentEntity): Student {
        const instance = new Student(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
