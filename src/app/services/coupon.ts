//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { Coupon } from '@/domain';
import { IRepository, ICouponRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { CouponStatus } from '@/domain/types';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.CouponService)
export class CouponService extends BaseService<Coupon> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Coupon> {
        return Container.get<ICouponRepository>(TYPES.CouponRepository);
    }

    /**
     * Verify coupon
     *
     * @param {string} coupon
     * @returns {string} id of the entity
     * @memberof CouponService
     */
    public async verifyCoupon(coupon: string): Promise<Partial<Coupon> | null> {
        const [couponCode] = await this.query([
            { code: coupon, operator: '==' },
            { status: CouponStatus.ACTIVE, operator: '==' }
        ]);

        return isEmpty(couponCode) || typeof couponCode === undefined ? null : couponCode.serialize();
    }
}
