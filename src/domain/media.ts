import { injectable } from 'inversify';
import { Entity } from './entity';
import { IMediaEntity } from './types';

@injectable()
export class Media extends Entity<IMediaEntity> {
    constructor(props: IMediaEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Media properties
     * @returns Media
     */
    public static create(props: IMediaEntity): Media {
        const instance = new Media(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
