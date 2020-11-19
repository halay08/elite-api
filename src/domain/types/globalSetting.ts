import { IEntity, ITimstamp } from '.';

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
type IGlobalSetttingEntity = IEntity & Required<IGlobalSettting> & ITimstamp;

export { IGlobalSettting, IGlobalSetttingEntity };
