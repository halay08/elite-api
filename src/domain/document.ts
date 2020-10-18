import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export enum DocumentType {
    CURRICULUM = 'curriculum',
    SLIDE = 'slide',
    MEDIA = 'media',
    BOOK = 'book',
    OTHER = 'other'
}

export type IDocument = {
    name: NonNullable<string>;

    /**
     * Document Type
     */
    type: DocumentType;

    /**
     * Document URL
     */
    url: string;

    /**
     * Document description
     */
    description?: string;
};

/**
 * Document entity
 */
export type IDocumentEntity = domain.IEntity & IDocument & domain.ITimstamp;

// Collection: documents
@injectable()
export default class Document extends Entity<IDocumentEntity> {
    constructor(props: IDocumentEntity, _id?: string) {
        super(props, _id);
    }
}
