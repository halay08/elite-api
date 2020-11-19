import { injectable } from 'inversify';

import { Entity } from './entity';
import { IUserEntity } from './types';

// Collection: users
@injectable()
export default class User extends Entity<IUserEntity> {
    constructor(props: Partial<IUserEntity>) {
        super(props);
    }
}
