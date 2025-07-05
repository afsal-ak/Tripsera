
 export type CouponType = 'percentage' | 'flat';

export interface ICoupon {
   code: string;
  type: CouponType;
  discountValue: number;
  expiryDate: Date;
  minAmount?: number;
  maxDiscountAmount?: number;  
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
