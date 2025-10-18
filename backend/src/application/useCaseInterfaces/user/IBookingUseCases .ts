import { CreateBookingDTO,
  BookingDetailResponseDTO, 
  BookingUserResponseDTO
} from '@application/dtos/BookingDTO';

export interface IBookingUseCases {
  getAllUserBooking(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: BookingUserResponseDTO[]; total: number }>;

  getBookingById(userId: string, bookingId: string): Promise<BookingDetailResponseDTO | null>;

  cancelBooking(userId: string, bookingId: string, reason: string): Promise<BookingDetailResponseDTO | null>;

  createBookingWithOnlinePayment(
    userId: string,
    data: CreateBookingDTO & { useWallet?: boolean }
  ): Promise<{
    booking: BookingDetailResponseDTO;
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

  confirmBookingAfterPayment(orderId: string, paymentId: string, signature: string): Promise<void>;

  cancelUnpaidBooking(userId: string, bookingId: string): Promise<void>;

  retryBookingPayment(
    userId: string,
    bookingId: string
  ): Promise<{
    booking: BookingDetailResponseDTO;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
    };
  }>;

  createBookingWithWalletPayment(
    userId: string,
    data: CreateBookingDTO & { useWallet?: boolean }
  ): Promise<{ booking?: BookingDetailResponseDTO }>;

  removeTraveler(bookingId: string, travelerIndex: number, userId: string, note?: string): Promise<BookingDetailResponseDTO|null>
  changeTravelDate(bookingId: string, newDate: Date, userId: string, note?: string): Promise<BookingDetailResponseDTO>
}
