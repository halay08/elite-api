import { IEntity } from './types';

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<T extends IEntity> {
    protected readonly _id: string;
    protected _props: T;

    /**
     * Creates an instance of entity.
     * @param props
     */
    constructor(props: T) {
        this._props = props;
    }

    /**
     * Serializes entity
     * @returns serialize
     */
    public serialize(): T {
        return {
            ...this._props
        };
    }

    /**
     * Props getter
     */
    get props(): T {
        return this._props;
    }

    /**
     * Equals entity
     * @param [object]
     * @returns boolean
     */
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
