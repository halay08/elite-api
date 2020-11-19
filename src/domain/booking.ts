import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingEntity } from './types';

// Collection: booking
@injectable()
export default class Booking extends Entity<IBookingEntity> {
    constructor(props: IBookingEntity) {
        super(props);
    }
}
