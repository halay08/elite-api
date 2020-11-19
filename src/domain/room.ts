import { injectable } from 'inversify';

import { Entity } from './entity';
import { IRoomEntity } from './types';

// Collection: rooms
@injectable()
export default class Room extends Entity<IRoomEntity> {
    constructor(props: IRoomEntity) {
        super(props);
    }
}
