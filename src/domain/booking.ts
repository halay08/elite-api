import { injectable } from 'inversify';

import { Entity } from './entity';
import { IBookingEntity } from './types';

// Collection: booking
@injectable()
export default class Booking extends Entity<IBookingEntity> {
    constructor(props: IBookingEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Booking properties
     * @returns Booking
     */
    public static create(props: IBookingEntity): Booking {
        const instance = new Booking(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
