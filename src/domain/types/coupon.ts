import { ITimestamp, IEntity } from './index';

export enum CouponStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}
type ICoupon = {
    code: string;
    status: CouponStatus;
};

type ICouponEntity = IEntity & ICoupon & ITimestamp;

type IEmbedCoupon = Partial<ICoupon>;

export { ICoupon, ICouponEntity, IEmbedCoupon };
