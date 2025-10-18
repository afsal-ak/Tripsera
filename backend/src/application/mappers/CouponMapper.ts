import { ICoupon } from '@domain/entities/ICoupon';
import { CouponResponseDTO } from '@application/dtos/CouponDTO';

export abstract class CouponMapper {
  static toResponseDTO(coupon: ICoupon): CouponResponseDTO {
    return {
      _id: coupon._id?.toString() || '',
      code: coupon.code,
      type: coupon.type,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate,
      minAmount: coupon.minAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      isActive: coupon.isActive,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    };
  }
}
