import { injectable } from 'inversify';
import { IDocumentReference } from '../infra/database/types';
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

    /**
     * Gets id
     */
    get id(): string {
        return this._props.id || '';
    }

    /**
     * Gets name
     */
    get name(): string {
        return this._props.name;
    }

    /**
     * Gets slug
     */
    get slug(): string {
        return this._props.slug;
    }

    /**
     * Gets tutor reference
     */
    get tutor(): IDocumentReference {
        return this._props.tutor;
    }
}
