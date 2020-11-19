import { IEntity } from './types';

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<T extends IEntity> {
    protected readonly _id: string;
    protected props: T;

    constructor(props: T) {
        this.props = props;
    }

    public serialize(): T {
        return {
            ...this.props
        };
    }

    public equals(object?: Entity<T>): boolean {
        if (object === null || object === undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id === object._id;
    }
}
