import * as UniqueEntityID from 'cuid';

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export abstract class Entity<T> {
    protected readonly _id: string;
    protected props: Partial<T>;

    constructor(props: Partial<T>, _id?: string) {
        this._id = _id ?? UniqueEntityID();
        this.props = props;
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
