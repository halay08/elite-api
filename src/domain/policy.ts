import { injectable } from 'inversify';

import { Entity } from './entity';
import { IPolicyEntity } from './types';

// Collection: policies
@injectable()
export default class Policy extends Entity<IPolicyEntity> {
    constructor(props: IPolicyEntity) {
        super(props);
    }
}
