import { IBooking } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { IBookingUseCases } from '@application/useCaseInterfaces/user/IBookingUseCases ';
import { RazorpayService } from '@infrastructure/services/razorpay/razorpayService';
import { AppError } from '@shared/utils/AppError';
import { generateBookingCode } from '@shared/utils/generateBookingCode';

export class BookingUseCases implements IBookingUseCases {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _razorpayService: RazorpayService
  ) {}

  async getAllUserBooking(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: IBooking[]; total: number }> {
    return await this._bookingRepo.getAllBookingOfUser(userId, page, limit);
  }

  async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    return await this._bookingRepo.getBookingById(userId, bookingId);
  }

  async cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new AppError(400, 'Booking already cancelled');
    }

    if (booking.paymentStatus === 'paid' && booking.amountPaid > 0) {
      await this._walletRepo.creditWallet(
        userId,
        booking.amountPaid,
        `Refund for cancelled booking`
      );
    }

    return await this._bookingRepo.cancelBooking(userId, bookingId, reason);
  }

  async createBookingWithOnlinePayment(
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
  }> {
    const {
      packageId,
      travelers,
      contactDetails,
      totalAmount,
      amountPaid,
      couponCode,
      travelDate,
      paymentMethod,
      walletAmountUsed,
      discount,
    } = data;
    console.log(data, 'booking data ');
    const finalAmount = amountPaid;
    const bookingCode = await generateBookingCode();

    const bookingData: IBookingInput = {
      packageId: packageId.toString(),
      //  userId,
      travelers,
      contactDetails,
      travelDate,
      totalAmount,
      discount,
      couponCode,
      walletAmountUsed,
      amountPaid: finalAmount,
      paymentMethod,
      bookingCode: bookingCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const booking = await this._bookingRepo.createBooking(userId, bookingData);

    if (!booking || !booking._id) {
      throw new Error('Booking failed');
    }
    const razorpayOrder = await this._razorpayService.createOrder(
      finalAmount,
      booking._id.toString()
    );

    await this._bookingRepo.updateBooking(booking._id.toString(), {
      razorpay: {
        orderId: razorpayOrder.id,
      },
    });
    return {
      booking,
      razorpayOrder,
    };
  }

  async verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    return await this._razorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
  }

  async confirmBookingAfterPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<void> {
    const booking = await this._bookingRepo.findByRazorpayOrderId(orderId);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    if (booking.walletAmountUsed && booking.walletAmountUsed > 0) {
      await this._walletRepo.debitWallet(booking.userId.toString(), booking.walletAmountUsed);
      console.log('wallet debited from user');
    }
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    booking.updatedAt = new Date();
    booking.razorpay = {
      orderId,
      paymentId,
      signature,
    };

    await this._bookingRepo.updateBooking(booking._id!.toString(), booking);
  }

  async cancelUnpaidBooking(userId: string, bookingId: string): Promise<void> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    if (booking.paymentStatus === 'paid') {
      throw new AppError(400, 'Cannot cancel a paid booking');
    }

    booking.bookingStatus = 'pending';
    booking.paymentStatus = 'failed';
    booking.updatedAt = new Date();

    await this._bookingRepo.updateBooking(bookingId, booking);
  }

  async retryBookingPayment(
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
  }> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);

    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    if (booking.paymentStatus === 'paid') {
      throw new AppError(400, 'Booking already paid');
    }
    if (!booking._id) {
      throw new Error('Booking ID missing');
    }

    const finalAmount = booking.amountPaid;
    const receipt = `retry-${booking._id.toString().slice(0, 30)}`;

    const razorpayOrder = await this._razorpayService.createOrder(finalAmount, receipt);

    await this._bookingRepo.updateBooking(booking._id.toString(), {
      razorpay: {
        orderId: razorpayOrder.id,
      },
      updatedAt: new Date(),
    });

    return {
      booking,
      razorpayOrder,
    };
  }

  async createBookingWithWalletPayment(
    userId: string,
    data: IBookingInput & { useWallet?: boolean }
  ): Promise<{ booking?: IBooking }> {
    const {
      packageId,
      travelers,
      contactDetails,
      totalAmount,
      couponCode,
      travelDate,
      useWallet = false,
    } = data;

    const discount = 0;

    if (!useWallet) {
      // If user didn't select wallet, skip this route
      throw new AppError(400, 'Wallet usage not requested');
    }

    const wallet = await this._walletRepo.getUserWallet(userId);
    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }
    const walletBalance = wallet.balance;

    if (walletBalance < totalAmount) {
      // Wallet not enough, should redirect to Razorpay flow
      throw new AppError(400, 'Insufficient wallet balance');
    }

    // Wallet fully covers booking
    await this._walletRepo.debitWallet(userId, totalAmount, 'Used for booking');

    const bookingCode = await generateBookingCode();

    const bookingData: IBookingInput = {
      packageId: packageId.toString(),
      travelers,
      contactDetails,
      travelDate,
      totalAmount,
      discount,
      couponCode,
      walletUsed: totalAmount,
      amountPaid: 0,
      paymentMethod: 'wallet',
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      bookingCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const booking = await this._bookingRepo.createBooking(userId, bookingData);
    return { booking };
  }
}
