import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type ILanguage = {
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
export type ILanguageEntity = domain.IEntity & ILanguage & domain.ITimstamp;

// Collection: languages
@injectable()
export default class Language extends Entity<ILanguageEntity> {
    constructor(props: ILanguageEntity, _id?: string) {
        super(props, _id);
    }
}
