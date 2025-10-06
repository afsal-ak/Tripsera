import { Types } from 'mongoose';

import {
  EnumBookingStatus,
  EnumTravelerAction,
  EnumIdType,
  EnumDateChangeAction,
  EnumBookingHistoryAction
} from '@constants/enum/bookingEnum';
import { EnumGender } from '@constants/enum/commonEnum';
import { EnumPaymentMethod, EnumPaymentStatus } from '@constants/enum/paymentEnum';

export interface ITraveler {
  fullName: string;
  age: number;
  gender: EnumGender
  idType: EnumIdType
  idNumber: string;
}

export interface ITravelerHistory {
  traveler: ITraveler;
  action: EnumTravelerAction
  changedBy?: string;
  changedAt: Date;
  note?: string;

}

export interface ITravelDateHistory {
  oldDate?: Date;
  newDate: Date;
  action: EnumDateChangeAction
  changedBy?: string; // userId or "admin"
  changedAt: Date;
  note?: string;

}

export interface IAdjustmentHistory {
  oldAmount: number;
  newAmount: number;
  refundAmount?: number;
  extraAmount?: number;
  reason: string;
  processedBy: string; // userId or "admin"
  processedAt: Date;
}

export interface IBookingHistory {
  action: EnumBookingHistoryAction
  oldValue?: any;
  newValue?: any;
  changedBy: string; // userId or "admin"
  changedAt: Date;
  note?: string;
}

export interface IBooking {
  _id?: string | Types.ObjectId;
  bookingCode: string;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;

  travelers: ITraveler[];
  travelerHistory?: ITravelerHistory[];

  totalAmount: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: EnumPaymentMethod
  paymentStatus: EnumPaymentStatus

  bookingStatus: EnumBookingStatus
  adminNote?: string;
  cancelledBy?: string;
  cancelReason?: string;

  walletUsed?: number;
  walletAmountUsed?: number;
  amountPaid: number;

  contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email: string;
  };

  travelDate?: Date;
  previousDates?: ITravelDateHistory[];
  rescheduleCount?: number;

  adjustments?: IAdjustmentHistory[];
  history?: IBookingHistory[];

  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };

  createdAt: Date;
  updatedAt: Date;
  bookedAt?: Date;
}
