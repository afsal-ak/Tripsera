import { ICoupon } from '@domain/entities/ICoupon';

export interface ICouponUseCases {
  getActiveCoupons(page: number, limit: number): Promise<{ coupons: ICoupon[]; total: number }>;

  applyCoupon(code: string, totalAmount: number): Promise<number>;
}
