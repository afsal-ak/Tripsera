import mongoose, { Schema, Document, model } from 'mongoose';
import { ICoupon } from '@domain/entities/ICoupon';

//  export interface IWishlistDocument extends IWishlist, Document {}
export interface CouponDocument extends ICoupon, Document { }

const couponSchema: Schema = new Schema<CouponDocument>(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ['percentage', 'flat'],
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        minAmount: { type: Number },
        maxDiscountAmount: { type: Number }, // only applies to 'percentage' type
        isActive: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

export const CouponModel = model<CouponDocument>("Coupon", couponSchema);
