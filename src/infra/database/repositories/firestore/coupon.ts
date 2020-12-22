import { provide } from 'inversify-binding-decorators';
import { Coupon } from '@/domain';
import { CouponMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ICouponRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ICouponEntity } from '@/domain/types';

@provide(TYPES.CouponRepository)
export class CouponRepository extends BaseRepository<Coupon> implements ICouponRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.Coupon;
    }

    /**
     * Map fields to domain entity
     * @param coupon Entity raw field
     * @returns domain
     */
    protected toDomain(coupon: Coupon): Coupon {
        return CouponMapper.toDomain(coupon);
    }

    /**
     * Serialize domain entity
     * @param data Entity object
     * @returns serialize
     */
    protected serialize(data: Coupon): ICouponEntity {
        return data.serialize();
    }
}
