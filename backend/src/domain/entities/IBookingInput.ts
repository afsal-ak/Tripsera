// import { ITraveler } from "./IBooking";

// export interface IBookingInput {
//   packageId: string;
//   travelDate: Date;
// contactDetails: {
//     name: string;
//     phone: string;
//     alternatePhone?: string;
//     email: string;
//   };
//     travelers: ITraveler[];


   

//   paymentMethod: "razorpay" | "wallet";

//   totalAmount: number; 
//   discount?: number;
//   couponCode?: string;

//   razorpay?: {
//     orderId?: string;
//     paymentId?: string;
//     signature?: string;
//   };
// }
export interface IBookingInput {
  packageId: string;
  travelDate: Date;
  travelers: {
    fullName: string;
    age: number;
    gender: "male" | "female" | "other";
    id: string;
  }[];
  contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
  };
  totalAmount: number;
  discount?: number;
  couponCode?: string;
  walletUsed?: number;
  amountPaid: number;
  paymentMethod: "wallet" | "razorpay";
  
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
