 
import { Types } from "mongoose";
import { EnumBookingStatus } from "@constants/enum/bookingEnum";
import { EnumPaymentStatus,EnumPaymentMethod } from "@constants/enum/paymentEnum";
export interface IBookingPopulatedForReport {
  _id: Types.ObjectId | string;
  bookingCode: string;
  userId: {
    _id: Types.ObjectId | string;
    username: string;
  };
  packageId: {
    _id: Types.ObjectId | string;
    title: string;
    packageCode: string;
  };
  totalAmount: number;
  discount?: number;
  walletAmountUsed?: number;
  amountPaid: number;
  paymentMethod: EnumPaymentMethod;
  paymentStatus: EnumPaymentStatus;
  bookingStatus: EnumBookingStatus;
  bookedAt?: Date;
  createdAt: Date;
  travelDate?: Date;
}
