import { injectable } from 'inversify';

import { Entity } from './entity';
import { ILanguageEntity } from './types';

// Collection: languages
@injectable()
export default class Language extends Entity<ILanguageEntity> {
    constructor(props: ILanguageEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: ILanguageEntity): Language {
        const instance = new Language(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
