import { injectable } from 'inversify';

import { Entity } from './entity';
import { ILanguageEntity } from './types';

// Collection: languages
@injectable()
export default class Language extends Entity<ILanguageEntity> {
    constructor(props: ILanguageEntity) {
        super(props);
    }
}
