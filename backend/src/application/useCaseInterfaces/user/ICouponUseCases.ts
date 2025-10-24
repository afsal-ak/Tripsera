import { CouponResponseDTO } from '@application/dtos/CouponDTO';

export interface ICouponUseCases {
  getActiveCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: CouponResponseDTO[]; total: number }>;

  applyCoupon(userId:string,code: string, totalAmount: number): Promise<number>;
}
