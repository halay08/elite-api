import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export enum PunishmentType {
    CASH = 'cash',
    PERCENTAGE = 'percentage'
}

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
    punishment_type: PunishmentType;
};

/**
 * Policy entity
 */
export type IPolicyEntity = domain.IEntity & IPolicy & domain.ITimstamp;

// Collection: policies
@injectable()
export default class Policy extends Entity<IPolicyEntity> {
    constructor(props: IPolicyEntity, _id?: string) {
        super(props, _id);
    }
}
