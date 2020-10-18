import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type IPolicy = {
    name: string;

    /**
     * Content of policy
     */
    content: string;

    /**
     * Penalty Amount (by $ or %)
     */
    punishment: number;

    /**
     * Punishment type ($ or %)
     */
    punishment_type: string;
};

/**
 * Policy entity
 */
export type IPolicyEntity = IPolicy & domain.ITimstamp;

// Collection: policies
@injectable()
export default class Policy extends Entity<IPolicyEntity> {
    constructor(props: IPolicyEntity, _id?: string) {
        super(props, _id);
    }
}
