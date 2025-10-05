import { IBooking, IBookingHistory, ITravelDateHistory } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { IBookingUseCases } from '@application/useCaseInterfaces/user/IBookingUseCases ';
import { RazorpayService } from '@infrastructure/services/razorpay/razorpayService';
import { AppError } from '@shared/utils/AppError';
import { generateBookingCode } from '@shared/utils/generateBookingCode';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';


export class BookingUseCases implements IBookingUseCases {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _userRepo: IUserRepository,
    private _packageRepo: IPackageRepository,
    private _razorpayService: RazorpayService,
    private _notificationUseCases: INotificationUseCases,
  ) { }

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
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, "Booking not found");
    }

    if (booking.bookingStatus === "cancelled") {
      throw new AppError(HttpStatus.BAD_REQUEST, "This booking is already cancelled");
    }

    //  Refund if already paid
    if (booking.paymentStatus === "paid" && booking.amountPaid > 0) {
      const wallet = await this._walletRepo.creditWallet(
        userId,
        booking.amountPaid,
        `Refund for cancelled booking ${booking.bookingCode}`
      );

      if (!wallet) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to refund wallet");
      }

      const walletMessage = `Your payment of ₹${booking.amountPaid} for booking ${booking.bookingCode} has been refunded to your wallet.`;

      await this._notificationUseCases.sendNotification({
        role: "user",
        userId: booking.userId.toString(),
        title: "Booking Refund",
        entityType: "wallet",
        walletId: wallet._id!.toString(),
        message: walletMessage,
        type: "success",
      });
    }

    // Get user + package details for admin notification
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    }

    const pkg = await this._packageRepo.findById(booking.packageId.toString());
    if (!pkg) {
      throw new AppError(HttpStatus.NOT_FOUND, "Package not found for this booking");
    }

    //  Notify Admins about cancellation
    const bookingMessage = `User ${user.username} cancelled booking for "${pkg.title}" (Reason: ${reason})`;

    await this._notificationUseCases.sendNotification({
      role: "admin",
      title: "Booking Cancelled",
      entityType: "booking",
      bookingId: booking._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: "warning",
      triggeredBy: userId,
      metadata: { bookingId: booking._id, reason },
    });

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
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    if (booking.walletAmountUsed && booking.walletAmountUsed > 0) {
      await this._walletRepo.debitWallet(booking.userId.toString(), booking.walletAmountUsed);
      console.log('wallet debited from user');
    }
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'booked';
    booking.updatedAt = new Date();
    booking.razorpay = {
      orderId,
      paymentId,
      signature,
    };
    const userId = booking.userId.toString()
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    }

    const pkg = await this._packageRepo.findById(booking.packageId.toString());
    if (!pkg) {
      throw new AppError(HttpStatus.NOT_FOUND, "Package not found for this booking");
    }
    let message = `User ${user.username} initiated a booking for package ${pkg.title}.`

    const notification = await this._notificationUseCases.sendNotification({

      role: 'admin',
      title: "New Booking",
      entityType: 'booking',
      bookingId: booking?._id?.toString(),
      packageId: booking?.packageId.toString(),
      message,
      type: "success",
      triggeredBy: userId,
      metadata: { bookingId: booking._id },
    });
    await this._bookingRepo.updateBooking(booking._id!.toString(), booking);



  }

  async cancelUnpaidBooking(userId: string, bookingId: string): Promise<void> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    if (booking.paymentStatus === 'paid') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot cancel a paid booking');
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
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.paymentStatus === 'paid') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Booking already paid');
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
      throw new AppError(HttpStatus.BAD_REQUEST, 'Wallet usage not requested');
    }

    const wallet = await this._walletRepo.getUserWallet(userId);
    if (!wallet) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Wallet not found');
    }
    const walletBalance = wallet.balance;

    if (walletBalance < totalAmount) {
      // Wallet not enough, should redirect to Razorpay flow
      throw new AppError(HttpStatus.BAD_REQUEST, 'Insufficient wallet balance');
    }
    const bookingCode = await generateBookingCode();

    // Wallet fully covers booking
    await this._walletRepo.debitWallet(userId, totalAmount, `Used for booking ${bookingCode}`);


    const bookingData: IBookingInput = {
      packageId: packageId.toString(),
      travelers,
      contactDetails,
      travelDate,
      totalAmount,
      discount,
      couponCode,
      walletUsed: true,
      walletAmountUsed: totalAmount,
      amountPaid: 0,
      paymentMethod: 'wallet',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      bookingCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const booking = await this._bookingRepo.createBooking(userId, bookingData);
    const user = await this._userRepo.findById(userId)
    const pkg = await this._packageRepo.findById(booking.packageId.toString())

    const message = `User ${user?.username} booked package ${pkg?.title})`;
    //  Save notification in DB
    const notification = await this._notificationUseCases.sendNotification({
      role: 'admin',
      title: "New Booking",
      entityType: 'booking',
      bookingId: booking?._id?.toString(),
      packageId: booking?.packageId.toString(),
      message,
      type: "success",
      triggeredBy: userId,
      metadata: { bookingId: booking._id },
    });


    return { booking };
  }

  async removeTraveler(
    bookingId: string,
    travelerIndex: number,
    userId: string,
    note?: string
  ): Promise<IBooking | null> {
    const bookingDoc = await this._bookingRepo.findById(bookingId);
    if (!bookingDoc) throw new AppError(HttpStatus.NOT_FOUND, "Booking not found");

    const removedTraveler = bookingDoc.travelers.splice(travelerIndex, 1)[0];

    // Track general booking history
    bookingDoc.history = bookingDoc.history || [];
    bookingDoc.history.push({
      action: "traveler_removed",
      oldValue: removedTraveler,
      newValue: null,
      changedBy: 'user',
      changedAt: new Date(),
      note,
    });

    // Track traveler-specific history with reason
    bookingDoc.travelerHistory = bookingDoc.travelerHistory || [];
    bookingDoc.travelerHistory.push({
      traveler: removedTraveler,
      action: "removed",
      changedBy: 'user',
      changedAt: new Date(),
      note,
    });

     if (bookingDoc.paymentStatus === "paid" && bookingDoc.amountPaid > 0) {
      // Calculate refund for removed traveler
      const perTravelerAmount = bookingDoc.amountPaid / (bookingDoc.travelers.length + 1); // +1 because we already removed one
      const refundAmount = perTravelerAmount;

      // Credit to user wallet
      const wallet = await this._walletRepo.creditWallet(
        bookingDoc.userId.toString(),
        refundAmount,
        `Refund for removed traveler ${removedTraveler.fullName} in booking ${bookingDoc.bookingCode}`
      );

      if (!wallet) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to refund wallet");
      }

      // Send notification to user
      await this._notificationUseCases.sendNotification({
        role: "user",
        userId: bookingDoc.userId.toString(),
        title: "Traveler Refund",
        entityType: "wallet",
        walletId: wallet._id!.toString(),
        message: `₹${refundAmount} refunded to your wallet for removed traveler ${removedTraveler.fullName}.`,
        type: "success",
      });

      // Track adjustment history
      bookingDoc.adjustments = bookingDoc.adjustments || [];
      bookingDoc.adjustments.push({
        oldAmount: bookingDoc.amountPaid,
        newAmount: bookingDoc.amountPaid - refundAmount,
        refundAmount,
        reason: note || "Traveler removed",
        processedBy: userId,
        processedAt: new Date(),
      });

      bookingDoc.amountPaid -= refundAmount;
    }

    // Cancel booking if no travelers remain
    if (bookingDoc.travelers.length === 0) {
      bookingDoc.bookingStatus = "cancelled";
      bookingDoc.cancelReason = note || "All travelers removed";
      bookingDoc.cancelledBy = 'user';
    }

    // Notify admin about traveler removal
    const pkg = await this._packageRepo.findById(bookingDoc.packageId.toString());
    await this._notificationUseCases.sendNotification({
      role: "admin",
      title: "Traveler Removed",
      entityType: "booking",
      bookingId: bookingDoc._id!.toString(),
      packageId: bookingDoc.packageId.toString(),
      message: `Traveler ${removedTraveler.fullName} removed from booking ${bookingDoc.bookingCode} (${pkg?.title || ""})`,
      type: "warning",
      triggeredBy: userId,
      metadata: { removedTraveler, note },
    });

    return await this._bookingRepo.updateBooking(bookingId, bookingDoc);
  }



  async changeTravelDate(bookingId: string, newDate: Date, userId: string, note?: string): Promise<IBooking> {
    const bookingDoc = await this._bookingRepo.findById(bookingId);
    if (!bookingDoc) throw new Error('Booking not found');

    const oldDate = bookingDoc.travelDate;

    bookingDoc.travelDate = newDate;

    // Update reschedule info
    bookingDoc.previousDates = bookingDoc.previousDates || [];
    bookingDoc.previousDates.push({
      oldDate: oldDate,
      newDate,
      action: newDate > oldDate! ? 'postponed' : 'preponed',
      changedBy: userId,
      changedAt: new Date(),
    });

    bookingDoc.rescheduleCount = (bookingDoc.rescheduleCount || 0) + 1;

    // Track history
    const historyItem: IBookingHistory = {
      action: 'date_changed',
      oldValue: oldDate,
      newValue: newDate,
      changedBy: userId,
      changedAt: new Date(),
      note,
    };

    bookingDoc.history = bookingDoc.history || [];
    bookingDoc.history.push(historyItem);

    return await this._bookingRepo.save(bookingDoc);
  }
}
