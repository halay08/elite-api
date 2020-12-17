import { Coupon } from '@/domain';

/**
 * Coupon mapper
 */
export class CouponMapper {
    public static toDomain(raw: any): Coupon {
        return Coupon.create({
            code: raw.code,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
