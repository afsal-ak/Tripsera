import { IBooking } from './IBooking';

export interface IBookingInput {
  bookingCode: string;
  packageId: string;
  travelDate: Date;

  travelers: {
    fullName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    idType: 'aadhaar' | 'pan' | 'passport';
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
  paymentMethod?: 'wallet' | 'razorpay' | 'wallet+razorpay';

  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };

  bookingStatus?: string;
  paymentStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookingData extends IBooking {
  bookingCode: string;
  packageId: string;
  travelDate: Date;
  packageTitle: string;
  packageImage: { url: string };
}
