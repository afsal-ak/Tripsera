import { ICoupon } from '@domain/entities/ICoupon';
import { MongoCouponRepository } from '@infrastructure/repositories/MongoCouponRepository';

export class CouponUseCases {
  constructor(private couponRepo: MongoCouponRepository) {}

  async getActiveCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; total: number }> {
    return this.couponRepo.getActiveCoupons(page, limit);
  }

  async applyCoupon(code: string, totalAmount: number): Promise<number> {
    const coupon = await this.couponRepo.getCouponByCode(code);

    if (!coupon) {
      throw new Error('Coupon does not exist');
    }
    if (!coupon.isActive) {
      throw new Error('Coupon is not active');
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new Error('Coupon has expired');
    }

    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      console.log(coupon.minAmount, 'min');
      throw new Error(`Minimum total amount should be ₹${coupon.minAmount}`);
    }

    let discount = 0;

    if (coupon.type === 'percentage') {
      discount = (coupon.discountValue / 100) * totalAmount;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else if (coupon.type === 'flat') {
      discount = coupon.discountValue;
    }

    return Math.floor(discount);
  }
}
