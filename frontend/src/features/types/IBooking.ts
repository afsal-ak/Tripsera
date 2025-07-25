export interface ITraveler {
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  id: string;
}

export interface IBooking {
  _id?: string;
  bookingCode: string;
  // userId:   string;
  packageId: {
    _id: string;
    title: string;
    price: string;
    imageUrls: { url: string }[];
    //  location: PackageLocation[];
  };
  userId: {
    _id: string;
    email: string;
    username: string;
  };

  travelers: ITraveler[];

  totalAmount: number;
  discount?: number;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  bookingStatus: 'confirmed' | 'booked' | 'cancelled' | 'pending';
  cancelReason?: string;
  walletUsed?: number;
  amountPaid: number;
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
  createdAt: Date;
  updatedAt: Date;
  bookedAt?: Date;
  travelDate?: Date;
  packageTitle?: string;
  packageImage?: { url: string; public_id?: string };
}
