import { injectable } from 'inversify';

import { Entity } from './entity';
import { IStudentEntity } from './types';

// Collection: students
@injectable()
export default class Student extends Entity<IStudentEntity> {
    constructor(props: IStudentEntity) {
        super(props);
    }
}
