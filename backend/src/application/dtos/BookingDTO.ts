import {
  EnumBookingStatus,
  EnumTravelerAction,
  EnumIdType,
  EnumDateChangeAction,
  EnumBookingHistoryAction,
} from '@constants/enum/bookingEnum';
import { EnumGender } from '@constants/enum/commonEnum';
import { EnumPaymentMethod, EnumPaymentStatus } from '@constants/enum/paymentEnum';

export interface CreateBookingDTO {
  bookingCode: string;
  packageId: string;
  travelDate: Date;

  travelers: {
    fullName: string;
    age: number;
    gender: EnumGender;
    idType: EnumIdType;
    idNumber: string;
  }[];

  contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email: string;
  };

  totalAmount: number;
  discount?: number;
  couponCode?: string;
  walletUsed?: boolean;
  walletAmountUsed?: number;
  amountPaid: number;
  paymentMethod?: EnumPaymentMethod;

  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };

  bookingStatus?: EnumBookingStatus;
  paymentStatus?: EnumPaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface AddTravellerDTO
  extends Omit<CreateBookingDTO, 'contactDetails' | 'travelDate' | 'razorpay'> {
  bookingId: string;
  travelers: {
    fullName: string;
    age: number;
    gender: EnumGender;
    idType: EnumIdType;
    idNumber: string;
  }[];
  totalAmount: number; // Cost for newly added travelers
  amountPaid: number; // Amount user pays (wallet or Razorpay)
  paymentMethod?: EnumPaymentMethod;
}

export interface UpdateBookingDTO extends Partial<CreateBookingDTO> {
  bookingId: string;
  adminNote?: string;
  cancelReason?: string;
  cancelledBy?: string;
  bookingStatus?: EnumBookingStatus;
}

// Traveler DTO
export interface TravelerDTO {
  fullName: string;
  age: number;
  gender: EnumGender;
  idType: EnumIdType;
  idNumber: string;
}

//  Traveler History DTO
export interface TravelerHistoryDTO {
  traveler: TravelerDTO;
  action: EnumTravelerAction;
  changedBy?: string;
  changedAt: Date;
  note?: string;
}

//  Travel Date History DTO
export interface TravelDateHistoryDTO {
  oldDate?: Date;
  newDate: Date;
  action: EnumDateChangeAction;
  changedBy?: string;
  changedAt: Date;
  note?: string;
}

//  Adjustment History DTO
export interface AdjustmentHistoryDTO {
  oldAmount: number;
  newAmount: number;
  refundAmount?: number;
  extraAmount?: number;
  reason: string;
  processedBy: string;
  processedAt: Date;
}

// Booking History DTO
export interface BookingHistoryDTO {
  action: EnumBookingHistoryAction;
  oldValue?: any;
  newValue?: any;
  changedBy: string;
  changedAt: Date;
  note?: string;
}

//  Basic Booking (Table) Response DTO for admin

export interface BookingTableResponseDTO {
  _id: string;
  bookingCode: string;
  userId: string;
  packageId: string;
  packageTitle: string;
  packageImage?: string;
  totalAmount: number;
  travelers: TravelerDTO[];
  discount: number;
  amountPaid: number;
  bookingStatus: EnumBookingStatus;
  paymentStatus: EnumPaymentStatus;
  travelDate?: Date;
  createdAt: Date;
}

//for user
export interface BookingUserResponseDTO {
  _id: string;
  bookingCode: string;
  packageId: string;
  packageTitle: string;
  packageImage?: string;
  totalAmount: number;
  amountPaid: number;
  discount?: number;
  bookingStatus: EnumBookingStatus;
  paymentStatus: EnumPaymentStatus;
  travelDate?: Date;
  createdAt: Date;
}
//  Detailed Booking Response DTO
export interface BookingDetailResponseDTO {
  _id: string;
  bookingCode: string;
  userId: string;
  packageId: string;
  travelers: TravelerDTO[];
  totalAmount: number;
  discount: number;
  couponCode?: string;
  walletAmountUsed?: number;
  amountPaid: number;
  paymentMethod: EnumPaymentMethod;
  paymentStatus: EnumPaymentStatus;
  bookingStatus: EnumBookingStatus;
  contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email: string;
  };
  travelDate?: Date;
  rescheduleCount?: number;
  travelerHistory?: TravelerHistoryDTO[];
  previousDates?: TravelDateHistoryDTO[];
  adjustments?: AdjustmentHistoryDTO[];
  history?: BookingHistoryDTO[];
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  bookedAt?: Date;
}
