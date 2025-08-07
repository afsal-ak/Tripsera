import { ICoupon } from '@domain/entities/ICoupon';

export interface ICouponUseCases {
  createCoupon(coupon: ICoupon): Promise<ICoupon>;

  editCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;

  getAllCoupon(page: number, limit: number): Promise<{
    coupons: ICoupon[];
    total: number;
  }>;

  getCouponById(id: string): Promise<ICoupon | null>;

  getCouponByCode(code: string): Promise<ICoupon | null>;

  updateCouponStatus(id: string, isActive: boolean): Promise<void>;

  deleteCoupon(id: string): Promise<void>;
}
