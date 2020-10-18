import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain } from './types';

export type ICategory = {
    /**
     * Name  of category entity
     */
    name: string;
};

/**
 * Category entity
 */
export type ICategoryEntity = domain.IEntity & Required<ICategory> & domain.ITimstamp;

@injectable()
export default class Category extends Entity<ICategoryEntity> {
    constructor(props: ICategoryEntity, _id?: string) {
        super(props, _id);
    }
}
