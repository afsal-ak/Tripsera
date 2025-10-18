import { CreateCouponDTO,UpdateCouponDTO,CouponResponseDTO } from '@application/dtos/CouponDTO';


export interface ICouponUseCases {
  createCoupon(coupon: CreateCouponDTO): Promise<CouponResponseDTO>;

  editCoupon(id: string, couponData:UpdateCouponDTO): Promise<CouponResponseDTO | null>;

  getAllCoupon(
    page: number,
    limit: number
  ): Promise<{
    coupons: CouponResponseDTO[];
    total: number;
  }>;

  getCouponById(id: string): Promise<CouponResponseDTO | null>;

  getCouponByCode(code: string): Promise<CouponResponseDTO | null>;

  updateCouponStatus(id: string, isActive: boolean): Promise<void>;

  deleteCoupon(id: string): Promise<void>;
}
