
 export type CouponType = 'percentage' | 'flat';

export interface ICoupon {
    _id:string;
   code: string;
  type: CouponType;
  discountValue: number;
  expiryDate: Date;
  minAmount?: number;
  maxDiscountAmount?: number;  
  isActive: boolean;
  
}
