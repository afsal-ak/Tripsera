import { IBooking } from "@domain/entities/IBooking";
import { IBookingInput } from "@domain/entities/IBookingInput";
import { IBookingRepository } from "@domain/repositories/IBookingRepository";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";

import { RazorpayService } from "@infrastructure/services/razorpay/razorpayService";
import { AppError } from "@shared/utils/AppError";
export class BookingUseCases {
  constructor(
    private bookingRepo: IBookingRepository,
    private walletRepo: IWalletRepository,
    private couponRepo: ICouponRepository,
    private razorpayService: RazorpayService
  ) { }

  async getAllUserBooking(userId: string, page: number, limit: number): Promise<{ bookings: IBooking[], total: number }> {
    return await this.bookingRepo.getAllBookingOfUser(userId, page, limit)
  }


  async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    return await this.bookingRepo.getBookingById(userId, bookingId)
  }

  // async cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null> {
  //   return await this.bookingRepo.cancelBooking(userId, bookingId, reason)
  // }

  async cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null> {
  const booking = await this.bookingRepo.getBookingById(userId, bookingId);
  if (!booking){
throw new AppError(404, "Booking not found");
  } 

  if (booking.bookingStatus === 'cancelled') {
    throw new AppError(400, "Booking already cancelled");
  }

   if (booking.paymentStatus === 'paid' && booking.amountPaid > 0) {
    await this.walletRepo.creditWallet(userId, booking.amountPaid, `Refund for cancelled booking`);
  }

   return await this.bookingRepo.cancelBooking(userId, bookingId, reason);
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
      couponCode,
      travelDate,
      paymentMethod,
      useWallet = false,
    } = data;

    let finalAmount = totalAmount;
    let discount = 0;
    let walletAmountUsed = 0;

   
    const bookingData: IBookingInput = {
      packageId: packageId.toString(),
      //  userId,
      travelers,
      contactDetails,
      travelDate,
      totalAmount,
      discount,
      couponCode,
      walletUsed: walletAmountUsed,
      amountPaid: finalAmount,
      paymentMethod,
      bookingStatus: finalAmount === 0 ? "confirmed" : "pending",
      paymentStatus: finalAmount === 0 ? "paid" : "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const booking = await this.bookingRepo.packageBooking(userId, bookingData);



    if (!booking || !booking._id) {
      throw new Error("Booking failed");
    }
    const razorpayOrder = await this.razorpayService.createOrder(
      finalAmount,
      booking._id.toString()
    );

    await this.bookingRepo.updateBooking(booking._id.toString(), {
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
    return await this.razorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
  }


  async confirmBookingAfterPayment(orderId: string, paymentId: string, signature: string): Promise<void> {
    const booking = await this.bookingRepo.findByRazorpayOrderId(orderId);
    if (!booking) throw new AppError(404, "Booking not found");

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    booking.updatedAt = new Date();
    booking.razorpay = {
      orderId,
      paymentId,
      signature,
    };

    await this.bookingRepo.updateBooking(booking._id!.toString(), booking);
  }

  async createBookingWithWalletPayment(
    userId: string,
    data: IBookingInput & { useWallet?: boolean }
  ): Promise<{
    booking?: IBooking;
    remainingAmountToPay?: number
  }> {
    const {
      packageId,
      travelers,
      contactDetails,
      totalAmount,
      couponCode,
      travelDate,
      // paymentMethod,
      useWallet = false,
    } = data;

    let remainingAmountToPay = totalAmount;
    let discount = 0;
    let walletAmountUsed = 0;

    if (useWallet) {
      const wallet = await this.walletRepo.getUserWallet(userId);
      if (!wallet) {
        throw new AppError(404, "Wallet not found");

      }
      console.log(wallet.balance, 'wallet balance')
      walletAmountUsed = Math.min(wallet.balance, remainingAmountToPay);
      if (walletAmountUsed > 0) {
        await this.walletRepo.debitWallet(userId, walletAmountUsed, "Used for booking");
        remainingAmountToPay -= walletAmountUsed;
      }
    }
    if (remainingAmountToPay <= 0) {
      const bookingData: IBookingInput = {
        packageId: packageId.toString(),
        //  userId,
        travelers,
        contactDetails,
        travelDate,
        totalAmount,
        discount,
        couponCode,
        walletUsed: walletAmountUsed,
        amountPaid: remainingAmountToPay,
        paymentMethod: 'wallet',
        bookingStatus: remainingAmountToPay === 0 ? "confirmed" : "pending",
        paymentStatus: remainingAmountToPay === 0 ? "paid" : "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const booking = await this.bookingRepo.packageBooking(userId, bookingData);
      return { booking };


    } else {
      return {
        remainingAmountToPay,
      };
    }

  }



}


