import { injectable } from 'inversify';

import { Entity } from './entity';
import { ISessionEntity } from './types';

@injectable()
export default class Session extends Entity<ISessionEntity> {
    constructor(props: ISessionEntity) {
        super(props);
    }
}
