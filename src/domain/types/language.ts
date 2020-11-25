import { IEntity, ITimestamp } from '.';

type ILanguage = {
    /**
     * Name  of language entity
     */
    name: string;

    /**
     * Code  of language entity
     */
    code: string;
};

/**
 * Language entity
 */
type ILanguageEntity = IEntity & ILanguage & ITimestamp;

export { ILanguage, ILanguageEntity };
