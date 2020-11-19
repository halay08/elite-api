import { IEntity, ITimstamp } from '.';

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
type ICountryEntity = IEntity & Required<ICountry> & ITimstamp;

export { ICountry, ICountryEntity };
