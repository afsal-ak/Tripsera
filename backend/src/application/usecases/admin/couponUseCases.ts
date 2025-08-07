import { ICoupon } from '@domain/entities/ICoupon';
import { ICouponRepository } from '@domain/repositories/ICouponRepository';
import { ICouponUseCases } from '@application/useCaseInterfaces/admin/ICouponUseCases';

export class CouponUseCases implements ICouponUseCases {

  constructor(private _couponRepo: ICouponRepository) {}

  async createCoupon(coupon: ICoupon): Promise<ICoupon> {
    return this._couponRepo.createCoupon(coupon);
  }

  async editCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
    return this._couponRepo.editCoupon(id, couponData);
  }

  async getAllCoupon(page: number, limit: number): Promise<{ coupons: ICoupon[]; total: number }> {
    return this._couponRepo.getAllCoupons(page, limit);
  }

  async getCouponById(id: string): Promise<ICoupon | null> {
    return this._couponRepo.getCouponById(id);
  }
  async getCouponByCode(code: string): Promise<ICoupon | null> {
    return this._couponRepo.getCouponByCode(code);
  }

  async updateCouponStatus(id: string, isActive: boolean): Promise<void> {
    return this._couponRepo.updateCouponStatus(id, isActive);
  }

  async deleteCoupon(id: string): Promise<void> {
    return this._couponRepo.deleteCoupon(id);
  }
}
