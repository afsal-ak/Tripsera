import { IBooking } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';

export interface IBookingUseCases {
  getAllUserBooking(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: IBooking[]; total: number }>;

  getBookingById(
    userId: string,
    bookingId: string
  ): Promise<IBooking | null>;

  cancelBooking(
    userId: string,
    bookingId: string,
    reason: string
  ): Promise<IBooking | null>;

  createBookingWithOnlinePayment(
    userId: string,
    data: IBookingInput & { useWallet?: boolean }
  ): Promise<{
    booking: IBooking;
    razorpayOrder?: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
    };
  }>;

  verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean>;

  confirmBookingAfterPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<void>;

  cancelUnpaidBooking(
    userId: string,
    bookingId: string
  ): Promise<void>;

  retryBookingPayment(
    userId: string,
    bookingId: string
  ): Promise<{
    booking: IBooking;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
    };
  }>;

  createBookingWithWalletPayment(
    userId: string,
    data: IBookingInput & { useWallet?: boolean }
  ): Promise<{ booking?: IBooking }>;
}
