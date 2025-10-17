import { EnumCouponType } from "@constants/enum/couponEnum";


export interface CreateCouponDTO {
    code: string;
    type: EnumCouponType;
    discountValue: number;
    expiryDate: Date;
    minAmount?: number;
    maxDiscountAmount?: number;
    isActive: boolean;
}

export interface UpdateCouponDTO {
    code?: string;
    type?: EnumCouponType;
    discountValue?: number;
    expiryDate?: Date;
    minAmount?: number;
    maxDiscountAmount?: number;
    isActive?: boolean;
}

export interface CouponResponseDTO {
    _id: string;
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
