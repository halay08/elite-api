import { injectable } from 'inversify';

import { Entity } from './entity';
import { ICouponEntity, CouponStatus } from './types';

// Collection: booking
@injectable()
export class Coupon extends Entity<ICouponEntity> {
    constructor(props: ICouponEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Coupon properties
     * @returns Coupon
     */
    public static create(props: ICouponEntity): Coupon {
        const instance = new Coupon(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }

    get code(): string {
        return this.code;
    }

    get status(): CouponStatus {
        return this.status;
    }
}
