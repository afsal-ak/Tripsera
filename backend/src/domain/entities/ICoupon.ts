import { Types } from 'mongoose';

import { EnumCouponType } from '@constants/enum/couponEnum';

export interface ICoupon {
  _id?: Types.ObjectId | string;
  code: string;
  type: EnumCouponType;
  discountValue: number;
  expiryDate: Date;
  minAmount?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
