import { IEntity, ITimestamp } from '.';

type IGlobalSettting = {
    name: string;

    /**
     * value of global settting
     */
    value: string;
};

/**
 * GlobalSettting entity
 */
type IGlobalSetttingEntity = IEntity & Required<IGlobalSettting> & ITimestamp;

export { IGlobalSettting, IGlobalSetttingEntity };
