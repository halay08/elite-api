import { injectable } from 'inversify';
import { Entity } from './entity';
import { ICategoryEntity } from './types';

@injectable()
export default class Category extends Entity<ICategoryEntity> {
    constructor(props: ICategoryEntity, _id?: string) {
        super(props);
    }
}
