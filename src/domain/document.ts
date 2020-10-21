import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type IDocument = {
    name: NonNullable<string>;

    /**
     * Type of document: curriculum,slide,media,book,other
     */
    type: string;

    /**
     * Document URL
     */
    url: string;

    /**
     * Document description
     */
    description: string;
};

/**
 * Document entity
 */
export type IDocumentEntity = IDocument & domain.ITimstamp;

// Collection: documents
@injectable()
export default class Document extends Entity<IDocumentEntity> {
    constructor(props: IDocumentEntity, _id?: string) {
        super(props, _id);
    }
}
