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
import {
  EnumBookingHistoryAction,
  EnumBookingStatus,
  EnumDateChangeAction,
  EnumTravelerAction,
} from '@constants/enum/bookingEnum';
import { EnumPaymentMethod, EnumPaymentStatus } from '@constants/enum/paymentEnum';
import { EnumUserRole } from '@constants/enum/userEnum';
import {
  BookingDetailResponseDTO,
  BookingUserResponseDTO,
  CreateBookingDTO,
  AddTravellerDTO,
  TravelerDTO
} from '@application/dtos/BookingDTO';
import { BookingMapper } from '@application/mappers/BookingMapper';
import { EnumNotificationEntityType, EnumNotificationType } from '@constants/enum/notificationEnum';
import { EnumPackageType } from '@constants/enum/packageEnum';

export class BookingUseCases implements IBookingUseCases {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _userRepo: IUserRepository,
    private _packageRepo: IPackageRepository,
    private _razorpayService: RazorpayService,
    private _notificationUseCases: INotificationUseCases
  ) { }

  async getAllUserBooking(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: BookingUserResponseDTO[]; total: number }> {
    const result = await this._bookingRepo.getAllBookingOfUser(userId, page, limit);
    return {
      bookings: result.bookings.map(BookingMapper.toUserResponseDTO),
      total: result.total,
    };
  }

  async getBookingById(
    userId: string,
    bookingId: string
  ): Promise<BookingDetailResponseDTO | null> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);
    return booking ? BookingMapper.toDetailResponseDTO(booking) : null;
  }

  async cancelBooking(
    userId: string,
    bookingId: string,
    reason: string
  ): Promise<BookingDetailResponseDTO | null> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.bookingStatus === EnumBookingStatus.CANCELLED) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'This booking is already cancelled');
    }
    if (
      booking.bookingStatus === EnumBookingStatus.CONFIRMED ||
      booking.bookingStatus === EnumBookingStatus.COMPLETED
    ) {
      console.log(booking.bookingStatus, 'id in booking');
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot cancel confirmed or completed booking');
    }

    //  Refund if already paid
    if (booking.paymentStatus === EnumPaymentStatus.PAID && booking.amountPaid > 0) {
      const wallet = await this._walletRepo.creditWallet(
        userId,
        booking.amountPaid,
        `Refund for cancelled booking ${booking.bookingCode}`
      );

      if (!wallet) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to refund wallet');
      }

      const walletMessage = `Your payment of ₹${booking.amountPaid} for booking ${booking.bookingCode} has been refunded to your wallet.`;
      await this._notificationUseCases.sendNotification({
        role: EnumUserRole.USER,
        userId: booking.userId.toString(),
        title: 'Booking Refund',
        entityType: EnumNotificationEntityType.WALLET,
        walletId: wallet._id!.toString(),
        message: walletMessage,
        type: EnumNotificationType.SUCCESS,
      });
    }

    // Get user + package details for admin notification
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const pkg = await this._packageRepo.findById(booking.packageId.toString());
    if (!pkg) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Package not found for this booking');
    }


    let travelersCount = booking.travelers.length
    // increment available slots for GROUP package
    if (pkg.packageType === EnumPackageType.GROUP) {
      const incremented = await this._packageRepo.incrementSlots(pkg._id!.toString(), travelersCount);
      if (!incremented) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update package slots');
      }
    }


    //  Notify Admins about cancellation
    const bookingMessage = `User ${user.username} cancelled booking for "${pkg.title}" (Reason: ${reason})`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'Booking Cancelled',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: booking._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: EnumNotificationType.WARNING,
      triggeredBy: userId,
      metadata: { bookingId: booking._id, reason },
    });

    const res = await this._bookingRepo.cancelBooking(userId, bookingId, reason);
    return res ? BookingMapper.toDetailResponseDTO(res) : null;
  }

  async createBookingWithOnlinePayment(
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

    // Fetch package data
    const pkgData = await this._packageRepo.findById(packageId);
    const availableSlots = pkgData?.availableSlots ?? 0;
    const travelersCount = travelers.length
    const packageType = data.packageType

    // Check if group package has enough slots
    if (packageType === EnumPackageType.GROUP) {
      if (availableSlots < travelersCount) {
        throw new AppError(
          HttpStatus.CONFLICT,
          `Only ${availableSlots} slot(s) available,
           but ${travelersCount} traveler(s) selected.
            Please reduce travelers or choose another date/package.`
        );
      }

      const updated = await this._packageRepo.decrementSlots(packageId, travelersCount);
      if (!updated) {
        throw new AppError(
          HttpStatus.CONFLICT,
          'Failed to reserve slots. Try again.'
        );
      }
    }

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
      booking: BookingMapper.toDetailResponseDTO(booking),
      razorpayOrder,
    };
  }
  async createBookingWithWalletPayment(
    userId: string,
    data: CreateBookingDTO & { useWallet?: boolean }
  ): Promise<{ booking?: BookingDetailResponseDTO }> {
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
    // Fetch package data
    const pkgData = await this._packageRepo.findById(packageId);
    const availableSlots = pkgData?.availableSlots ?? 0;
    const travelersCount = travelers.length
    const packageType = data.packageType

    // Check if group package has enough slots
    if (packageType === EnumPackageType.GROUP) {
      if (availableSlots < travelersCount) {
        throw new AppError(
          HttpStatus.CONFLICT,
          `Only ${availableSlots} slot(s) available,
           but ${travelersCount} traveler(s) selected.
            Please reduce travelers or choose another date/package.`
        );
      }

      const updated = await this._packageRepo.decrementSlots(packageId, travelersCount);
      if (!updated) {
        throw new AppError(
          HttpStatus.CONFLICT,
          'Failed to reserve slots. Try again.'
        );
      }
    }

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
    const user = await this._userRepo.findById(userId);
    const pkg = await this._packageRepo.findById(booking.packageId.toString());

    const message = `User ${user?.username} booked package ${pkg?.title})`;
    //  Save notification in DB
    const notification = await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'New Booking',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: booking?._id?.toString(),
      packageId: booking?.packageId.toString(),
      message,
      type: EnumNotificationType.SUCCESS,
      triggeredBy: userId,
      metadata: { bookingId: booking._id },
    });

    return { booking: BookingMapper.toDetailResponseDTO(booking) };
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
    }
    booking.paymentStatus = EnumPaymentStatus.PAID;
    booking.bookingStatus = EnumBookingStatus.BOOKED;
    booking.updatedAt = new Date();
    booking.razorpay = {
      orderId,
      paymentId,
      signature,
    };
    const userId = booking.userId.toString();
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const pkg = await this._packageRepo.findById(booking.packageId.toString());
    if (!pkg) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Package not found for this booking');
    }
    const message = `User ${user.username} initiated a booking for package ${pkg.title}.`;

    const notification = await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'New Booking',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: booking?._id?.toString(),
      packageId: booking?.packageId.toString(),
      message,
      type: EnumNotificationType.SUCCESS,
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
    if (booking.paymentStatus === EnumPaymentStatus.PAID) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot cancel a paid booking');
    }

    booking.bookingStatus = EnumBookingStatus.PENDING;
    booking.paymentStatus = EnumPaymentStatus.FAILED;
    booking.updatedAt = new Date();
    await this._bookingRepo.updateBooking(bookingId, booking);
  }

  async retryBookingPayment(
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
  }> {
    const booking = await this._bookingRepo.getBookingById(userId, bookingId);

    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.paymentStatus === EnumPaymentStatus.PAID) {
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
      booking: BookingMapper.toDetailResponseDTO(booking),
      razorpayOrder,
    };
  }


  async removeTraveler(
    bookingId: string,
    travelerIndex: number,
    userId: string,
    note?: string
  ): Promise<BookingDetailResponseDTO | null> {
    const bookingDoc = await this._bookingRepo.findById(bookingId);
    if (!bookingDoc) throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');

    // Check if booking is already cancelled
    if (bookingDoc.bookingStatus === EnumBookingStatus.CANCELLED) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot remove traveler from a cancelled booking');
    }

    if (bookingDoc.bookingStatus === EnumBookingStatus.CONFIRMED ||
      bookingDoc.bookingStatus === EnumBookingStatus.COMPLETED) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot remove traveler from a confirmed booking');
    }

    const removedTraveler = bookingDoc.travelers.splice(travelerIndex, 1)[0];

    bookingDoc.travelerHistory = bookingDoc.travelerHistory || [];
    bookingDoc.travelerHistory.push({
      traveler: removedTraveler,
      action: EnumTravelerAction.REMOVED,
      changedBy: 'user',
      changedAt: new Date(),
      note,
    });

    if (bookingDoc.paymentStatus === EnumPaymentStatus.PAID && bookingDoc.amountPaid > 0) {
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
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to refund wallet');
      }
      const pkg = await this._packageRepo.findById(bookingDoc.packageId.toString());
      if (!pkg) {
        throw new AppError(HttpStatus.NOT_FOUND, 'Package not found for this booking');
      }


      // increment available slots for GROUP package
      if (pkg.packageType === EnumPackageType.GROUP) {
        const incremented = await this._packageRepo.incrementSlots(pkg._id!.toString(), 1);
        if (!incremented) {
          throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update package slots');
        }
      }

      // Send notification to user
      await this._notificationUseCases.sendNotification({
        role: EnumUserRole.USER,
        userId: bookingDoc.userId.toString(),
        title: 'Traveler Refund',
        entityType: EnumNotificationEntityType.WALLET,
        walletId: wallet._id!.toString(),
        message: `₹${refundAmount} refunded to your wallet for removed traveler ${removedTraveler.fullName}.`,
        type: EnumNotificationType.SUCCESS,
      });

      // Track adjustment history
      bookingDoc.adjustments = bookingDoc.adjustments || [];
      bookingDoc.adjustments.push({
        oldAmount: bookingDoc.amountPaid,
        newAmount: bookingDoc.amountPaid - refundAmount,
        refundAmount,
        reason: note || 'Traveler removed',
        processedBy: userId,
        processedAt: new Date(),
      });

      bookingDoc.amountPaid -= refundAmount;
    }

    // Cancel booking if no travelers remain
    if (bookingDoc.travelers.length === 0) {
      bookingDoc.bookingStatus = EnumBookingStatus.CANCELLED;
      bookingDoc.cancelReason = note || 'All travelers removed';
      bookingDoc.cancelledBy = 'user';
    }
    const pkg = await this._packageRepo.findById(bookingDoc.packageId.toString());

    // Notify admin about traveler removal
    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'Traveler Removed',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: bookingDoc._id!.toString(),
      packageId: bookingDoc.packageId.toString(),
      message: `Traveler ${removedTraveler.fullName} removed from booking ${bookingDoc.bookingCode} (${pkg} || ''})`,
      type: EnumNotificationType.WARNING,
      triggeredBy: userId,
      metadata: { removedTraveler, note },
    });

    const booking = await this._bookingRepo.updateBooking(bookingId, bookingDoc);
    return booking ? BookingMapper.toDetailResponseDTO(booking) : null;
  }


  async addTravellerBookingWithOnlinePayment(
    userId: string,
    data: AddTravellerDTO & { useWallet?: boolean }
  ): Promise<{
    booking: BookingDetailResponseDTO;
    razorpayOrder?: {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
    };
  }> {
    const { bookingId, travelers, totalAmount, amountPaid, paymentMethod } = data;

    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking || !bookingId) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    // Fetch package data
    const pkgData = await this._packageRepo.findById(booking.packageId.toString());
    const availableSlots = pkgData?.availableSlots ?? 0;
    const travelersCount = travelers.length
    const packageType = booking.packageType
    const packageId = booking.packageId.toString()
    // Check if group package has enough slots
    if (packageType === EnumPackageType.GROUP) {
      if (availableSlots < travelersCount) {
        throw new AppError(
          HttpStatus.CONFLICT,
          `Only ${availableSlots} slot(s) available,
           but ${travelersCount} traveler(s) selected.
            Please reduce travelers or choose another date/package.`
        );
      }

      const updated = await this._packageRepo.decrementSlots(packageId, travelersCount);
      if (!updated) {
        throw new AppError(
          HttpStatus.CONFLICT,
          'Failed to reserve slots. Try again.'
        );
      }
    }


    // Merge new travelers into existing list
    const updatedTravelers = [...booking.travelers, ...travelers];

    // Maintain traveler history
    const travelerHistoryEntry = travelers.map((t) => ({
      traveler: t,
      action: EnumTravelerAction.ADDED,
      changedBy: userId,
      changedAt: new Date(),
    }));

    const finalAmount = amountPaid;
    const newTotal = booking.totalAmount + totalAmount;

    // Create Razorpay order for new payment
    const razorpayOrder = await this._razorpayService.createOrder(
      finalAmount,
      bookingId
    );

    // Update booking
    const updatedBooking = await this._bookingRepo.updateBooking(bookingId, {
      travelers: updatedTravelers,
      travelerHistory: [
        ...(booking.travelerHistory || []),
        ...travelerHistoryEntry,
      ],
      totalAmount: newTotal,
      amountPaid: booking.amountPaid + finalAmount,
      updatedAt: new Date(),
      razorpay: {
        orderId: razorpayOrder.id,
      },
    });

    await this._bookingRepo.addBookingHistory(bookingId, {
      action: EnumBookingHistoryAction.TRAVELER_ADDED,
      oldValue: booking.travelers,
      newValue: updatedTravelers,
      changedBy: EnumUserRole.USER,
      changedAt: new Date(),
      note: `Added ${travelers.length} traveler(s)`,
    });

    // Notification for admin
    const user = await this._userRepo.findById(userId);
    const message = `User ${user?.username} added ${travelers.length} traveler(s) to booking ${booking.bookingCode}`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'Traveller Added',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: bookingId,
      packageId: booking.packageId.toString(),
      message,
      type: EnumNotificationType.INFO,
      triggeredBy: userId,
      metadata: { bookingId: booking._id },
    });

    return {
      booking: BookingMapper.toDetailResponseDTO(updatedBooking!),
      razorpayOrder,
    };
  }
  async addTravellerBookingWithWalletPayment(
    userId: string,
    data: AddTravellerDTO & { useWallet?: boolean }
  ): Promise<{ booking?: BookingDetailResponseDTO }> {
    const { bookingId, travelers, totalAmount, useWallet = false } = data;

    if (!useWallet) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Wallet usage not requested');
    }

    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    // Fetch package data
    const pkgData = await this._packageRepo.findById(booking.packageId.toString());
    const availableSlots = pkgData?.availableSlots ?? 0;
    const travelersCount = travelers.length
    const packageType = booking.packageType
    const packageId = booking.packageId.toString()

    // Check if group package has enough slots
    if (packageType === EnumPackageType.GROUP) {
      if (availableSlots < travelersCount) {
        throw new AppError(
          HttpStatus.CONFLICT,
          `Only ${availableSlots} slot(s) available,
           but ${travelersCount} traveler(s) selected.
            Please reduce travelers or choose another date/package.`
        );
      }

      const updated = await this._packageRepo.decrementSlots(packageId, travelersCount);
      if (!updated) {
        throw new AppError(
          HttpStatus.CONFLICT,
          'Failed to reserve slots. Try again.'
        );
      }
    }
    const wallet = await this._walletRepo.getUserWallet(userId);
    if (!wallet) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Wallet not found');
    }

    const walletBalance = wallet.balance;
    if (walletBalance < totalAmount) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Insufficient wallet balance');
    }

    await this._walletRepo.debitWallet(
      userId,
      totalAmount,
      `Used for adding travelers to booking ${booking.bookingCode}`
    );

    const updatedTravelers = [...booking.travelers, ...travelers];

    const travelerHistoryEntry = travelers.map((t) => ({
      traveler: t,
      action: EnumTravelerAction.ADDED,
      changedBy: userId,
      changedAt: new Date(),
    }));

    const newTotal = booking.totalAmount + totalAmount;

    const updatedBooking = await this._bookingRepo.updateBooking(bookingId, {
      travelers: updatedTravelers,
      travelerHistory: [
        ...(booking.travelerHistory || []),
        ...travelerHistoryEntry,
      ],
      totalAmount: newTotal,
      walletAmountUsed: (booking.walletAmountUsed || 0) + totalAmount,
      updatedAt: new Date(),
    });

    await this._bookingRepo.addBookingHistory(bookingId, {
      action: EnumBookingHistoryAction.TRAVELER_ADDED,
      oldValue: booking.travelers,
      newValue: updatedTravelers,
      changedBy: EnumUserRole.USER,
      changedAt: new Date(),
      note: `Added ${travelers.length} traveler(s) using wallet`,
    });

    // Notification for admin
    const user = await this._userRepo.findById(userId);
    const message = `User ${user?.username} added ${travelers.length} traveler(s) to booking ${booking.bookingCode} using wallet`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: 'Traveler Added',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: bookingId,
      packageId: booking.packageId.toString(),
      message,
      type: EnumNotificationType.INFO,
      triggeredBy: userId,
      metadata: { bookingId: booking._id },
    });

    return {
      booking: BookingMapper.toDetailResponseDTO(updatedBooking!),
    };
  }

  async changeTravelDate(
    bookingId: string,
    newDate: Date,
    userId: string,
    note?: string
  ): Promise<BookingDetailResponseDTO> {
    const bookingDoc = await this._bookingRepo.findById(bookingId);
    if (!bookingDoc) throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');

    const oldDate = bookingDoc.travelDate;
    const today = new Date();
    const newTravelDate = new Date(newDate);

    if (oldDate && newTravelDate.getTime() === oldDate.getTime())
      throw new AppError(HttpStatus.BAD_REQUEST, 'New travel date cannot be the same');
    if (newTravelDate < today)
      throw new AppError(HttpStatus.BAD_REQUEST, 'New travel date cannot be in the past');
    if (bookingDoc.bookingStatus === 'confirmed')
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Cannot change travel date for confirmed bookings'
      );

    const updated = await this._bookingRepo.updateById(bookingId, {
      $set: {
        travelDate: newTravelDate,
      },
      $push: {
        previousDates: {
          oldDate,
          newDate: newTravelDate,
          action:
            oldDate && newTravelDate > oldDate
              ? EnumDateChangeAction.POSTPONED
              : EnumDateChangeAction.PREPONED,
          changedBy: 'user',
          changedAt: new Date(),
        },
        history: {
          action: EnumBookingHistoryAction.DATE_CHANGED,
          oldValue: oldDate,
          newValue: newTravelDate,
          changedBy: 'user',
          changedAt: new Date(),
          note,
        },
      },
      $inc: { rescheduleCount: 1 },
    });

    return BookingMapper.toDetailResponseDTO(updated!);
  }
}
