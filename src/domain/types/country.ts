import { IEntity, ITimestamp } from '.';

type ICountry = {
    /**
     * Name  of country entity
     */
    name: string;

    /**
     * Code  of country entity
     */
    code: string;
};

/**
 * Country entity
 */
type ICountryEntity = IEntity & Required<ICountry> & ITimestamp;

export { ICountry, ICountryEntity };
