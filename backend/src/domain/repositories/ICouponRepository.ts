import { ICoupon } from '@domain/entities/ICoupon';

export interface ICouponRepository {
  createCoupon(couponData: ICoupon): Promise<ICoupon>;
  getAllCoupons(page: number, limit: number): Promise<{ coupons: ICoupon[]; total: number }>;
  getActiveCoupons(page: number, limit: number): Promise<{ coupons: ICoupon[]; total: number }>;
  getCouponById(id: string): Promise<ICoupon | null>;
  getCouponByCode(code: string): Promise<ICoupon | null>;
  editCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null>;
  updateCouponStatus(id: string, isActive: boolean): Promise<void>;
  deleteCoupon(id: string): Promise<void>;
}
