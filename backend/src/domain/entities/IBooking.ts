import { Types } from "mongoose";

export interface ITraveler {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  id:string
}

export interface IBooking {
  _id?: string | Types.ObjectId;
  userId: Types.ObjectId | string;
  packageId: Types.ObjectId | string;
    travelers: ITraveler[];

  totalAmount: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: "razorpay" | "wallet";
  paymentStatus: "paid" | "pending" | "failed";
  bookingStatus: "confirmed"|"booked" | "cancelled" |"pending";
  cancelReason?: string;
  walletUsed?:number;
amountPaid:number;
 contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email: string;
  };
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  createdAt:Date;
  updatedAt:Date;
  bookedAt?: Date;
  travelDate?: Date;
}
