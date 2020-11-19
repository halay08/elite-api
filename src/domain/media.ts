import { injectable } from 'inversify';
import { Entity } from './entity';
import { IMediaEntity } from './types';

@injectable()
export default class Media extends Entity<IMediaEntity> {
    constructor(props: IMediaEntity) {
        super(props);
    }
}
