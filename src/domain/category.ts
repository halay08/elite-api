import { injectable } from 'inversify';
import { Entity } from './entity';
import { ICategoryEntity } from './types';

@injectable()
export class Category extends Entity<ICategoryEntity> {
    constructor(props: ICategoryEntity, _id?: string) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Category properties
     * @returns Category
     */
    public static create(props: ICategoryEntity): Category {
        const instance = new Category(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this.props.name;
    }
}
