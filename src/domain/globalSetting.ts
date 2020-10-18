import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type IGlobalSettting = {
    name: string;

    /**
     * value of global settting
     */
    value: string;
};

/**
 * GlobalSettting entity
 */
export type IGlobalSetttingEntity = domain.IEntity & Required<IGlobalSettting> & domain.ITimstamp;

// Collection: global_settings
@injectable()
export default class GlobalSettting extends Entity<IGlobalSetttingEntity> {
    constructor(props: IGlobalSetttingEntity, _id?: string) {
        super(props, _id);
    }
}
