import { injectable } from 'inversify';

import { Entity } from './entity';
import { IGlobalSetttingEntity } from './types';

// Collection: global_settings
@injectable()
export default class GlobalSettting extends Entity<IGlobalSetttingEntity> {
    constructor(props: IGlobalSetttingEntity) {
        super(props);
    }
}
