import { injectable } from 'inversify';
import { Entity } from './entity';
import { ICourseEntity } from './types';

@injectable()
export default class Course extends Entity<ICourseEntity> {
    constructor(props: ICourseEntity) {
        super(props);
    }
}
