
export interface ITraveler {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  idType: "aadhaar" | "pan" | "passport";
  idNumber: string;
}

export interface ITravelerHistory {
  traveler: ITraveler;
  action: "added" | "removed" | "updated";
  changedBy?: string;  
  changedAt?: Date;
    note?: string;

}

export interface ITravelDateHistory {
  oldDate?: Date; 
    newDate: Date;
  action: "preponed" | "postponed";
  changedBy?: string;  
  changedAt?: Date;
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
  action: "traveler_removed" | "traveler_added" | "date_changed" | "status_changed" | "amount_changed";
  oldValue?: any;
  newValue?: any;
  changedBy: string; // userId or "admin"
  changedAt: Date;
  note?: string;
}

export interface IBooking {
  _id?: string  ;
  bookingCode: string;
  //userId:string;
  packageId: {
    _id: string;
    title: string;
    price: string;
    packageCode:string;
    imageUrls: { url: string }[];
    //  location: PackageLocation[];
  };
  userId: {
    _id: string;
    email: string;
    username: string;
  };
 
  travelers: ITraveler[];
  travelerHistory?: ITravelerHistory[];

  totalAmount: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'wallet' | 'wallet+razorpay';
  paymentStatus: 'paid' | 'pending' | 'failed';

  bookingStatus: 'confirmed' | 'booked' | 'cancelled' | 'pending';
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
   packageTitle?: string;
  packageCode?: string;
  packageImage?: { url: string; public_id?: string };
}


// export interface ITraveler {
//   fullName: string;
//   age: number;
//   gender: "male" | "female" | "other";
//   idType: "aadhaar" | "pan" | "passport";
//   idNumber: string;
// }

// export interface IBooking {
//   _id?: string;
//   bookingCode: string;
//   // userId:   string;
//   packageId: {
//     _id: string;
//     title: string;
//     price: string;
//     packageCode:string;
//     imageUrls: { url: string }[];
//     //  location: PackageLocation[];
//   };
//   userId: {
//     _id: string;
//     email: string;
//     username: string;
//   };

//   travelers: ITraveler[];

//   totalAmount: number;
//   discount?: number;
//   couponCode?: string;
//   paymentMethod: 'razorpay' | 'wallet';
//   paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
//   bookingStatus: 'confirmed' | 'booked' | 'cancelled' | 'pending';
//   cancelReason?: string;
//   walletUsed?: boolean;
//   walletAmountUsed?:number;
//   amountPaid: number;
//   contactDetails: {
//     name: string;
//     phone: string;
//     alternatePhone?: string;
//     email: string;
//   };
//   razorpay?: {
//     orderId?: string;
//     paymentId?: string;
//     signature?: string;
//   };
//   createdAt: Date;
//   updatedAt: Date;
//   bookedAt?: string;
//   travelDate?: string;
//   packageTitle?: string;
//   packageCode?: string;
//   packageImage?: { url: string; public_id?: string };
// }
