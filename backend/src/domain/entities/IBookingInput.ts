
export interface IBookingInput {
  bookingCode:string;
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
     email: string;
  };
  totalAmount: number;
  discount?: number;
  couponCode?: string;
  walletUsed?: number;
  walletAmountUsed?:number;
  amountPaid: number;
  paymentMethod?: "wallet" | "razorpay" | "wallet+razorpay";
  
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
