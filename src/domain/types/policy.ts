import { IEntity, ITimstamp } from '.';

enum PunishmentType {
    CASH = 'cash',
    PERCENTAGE = 'percentage'
}

type IPolicy = {
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
type IPolicyEntity = IEntity & IPolicy & ITimstamp;

export { PunishmentType, IPolicy, IPolicyEntity };
