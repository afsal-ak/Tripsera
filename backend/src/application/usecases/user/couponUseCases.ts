import { ICouponUseCases } from '@application/useCaseInterfaces/user/ICouponUseCases';
import { ICouponRepository } from '@domain/repositories/ICouponRepository';
import { CouponResponseDTO } from '@application/dtos/CouponDTO';
import { CouponMapper } from '@application/mappers/CouponMapper';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { EnumCouponType } from '@constants/enum/couponEnum';

export class CouponUseCases implements ICouponUseCases {
  constructor(
    private _couponRepo: ICouponRepository,
    private _bookingRepo:IBookingRepository

  ) {}

  async getActiveCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: CouponResponseDTO[]; total: number }> {
    const result = await this._couponRepo.getActiveCoupons(page, limit);
    return {
      coupons: result.coupons.map(CouponMapper.toResponseDTO),
      total: result.total,
    };
  }

  async applyCoupon(userId:string,code: string, totalAmount: number): Promise<number> {
    const coupon = await this._couponRepo.getCouponByCode(code);

    if (!coupon) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Coupon does not exist');
    }

    if (!coupon.isActive) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Coupon is not active');
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Coupon has expired');
    }

    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        `Minimum total amount should be ₹${coupon.minAmount}`
      );
    }
 const previousBooking = await this._bookingRepo.findOne({
    userId,
    couponCode: code,
  });

  if (previousBooking) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'You have already used this coupon');
  }
    let discount = 0;

    if (coupon.type === EnumCouponType.PERCENTAGE) {
      discount = (coupon.discountValue / 100) * totalAmount;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else if (coupon.type ===EnumCouponType.FLAT) {
      discount = coupon.discountValue;
    }

    return Math.floor(discount);
  }
}
