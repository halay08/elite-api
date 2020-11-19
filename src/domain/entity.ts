import { IEntity } from './types';
export abstract class Entity<T extends IEntity> {
    constructor(props: Partial<T>) {
        Object.assign(this, props);
    }
}
