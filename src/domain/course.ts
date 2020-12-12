import { injectable } from 'inversify';
import { Entity } from './entity';
import { ICourseEntity } from './types';

@injectable()
export class Course extends Entity<ICourseEntity> {
    constructor(props: ICourseEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Course properties
     * @returns Course
     */
    public static create(props: ICourseEntity): Course {
        const instance = new Course(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
