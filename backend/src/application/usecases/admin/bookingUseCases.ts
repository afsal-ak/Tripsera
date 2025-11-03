import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IBookingUseCases } from '@application/useCaseInterfaces/admin/IBookingUseCases';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { EnumUserRole } from '@constants/enum/userEnum';
import { BookingDetailResponseDTO, BookingTableResponseDTO } from '@application/dtos/BookingDTO';
import { BookingMapper } from '@application/mappers/BookingMapper';
import { EnumDateChangeAction, EnumBookingHistoryAction } from '@constants/enum/bookingEnum';
import { EnumNotificationEntityType, EnumNotificationType } from '@constants/enum/notificationEnum';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { EnumPackageType } from '@constants/enum/packageEnum';
export class BookingUseCases implements IBookingUseCases {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _packageRepo: IPackageRepository,
    private _notificationUseCases: INotificationUseCases
  ) { }

  async getAllBookings(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: BookingTableResponseDTO[]; total: number }> {
    const result = await this._bookingRepo.getAllBooking(filters);

    return {
      bookings: result.bookings.map(BookingMapper.toAdminTableResponseDTO),
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

  async getBookingByIdForAdmin(bookingId: string): Promise<BookingDetailResponseDTO | null> {
    const booking = await this._bookingRepo.getBookingByIdForAdmin(bookingId);
    return booking ? BookingMapper.toDetailResponseDTO(booking) : null;
  }

  async cancelBookingByAdmin(
    bookingId: string,
    reason: string
  ): Promise<BookingDetailResponseDTO | null> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new AppError(HttpStatus.OK, 'Booking already cancelled');
    }

    const userId = booking.userId.toString();
    //  Refund if already paid
    if (booking.paymentStatus === 'paid' && booking.amountPaid > 0) {
      const wallet = await this._walletRepo.creditWallet(
        userId,
        booking.amountPaid,
        `Admin : Refund for cancelled booking ${booking.bookingCode}`
      );

      if (!wallet) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to refund wallet');
      }

      const walletMessage = `Your payment of ₹${booking.amountPaid} for booking ${booking.bookingCode} has been refunded to your wallet.`;

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



      await this._notificationUseCases.sendNotification({
        role: EnumUserRole.USER,
        userId,
        title: 'Booking Refund',
        entityType: EnumNotificationEntityType.WALLET,
        walletId: wallet._id!.toString(),
        message: walletMessage,
        type: EnumNotificationType.SUCCESS,
      });
    }

    const bookingMessage = `Admin Cancelled your booking  ${booking?.bookingCode} (Reason: ${reason})`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.USER,
      userId: userId.toString(),
      title: 'Booking Cancelled',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: booking?._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: EnumNotificationType.WARNING,
      metadata: { bookingId: booking._id, reason },
    });

    const bookings = await this._bookingRepo.cancelBookingByAdmin(bookingId, reason);
    return bookings ? BookingMapper.toDetailResponseDTO(bookings) : null;
  }

  async confirmBookingByAdmin(
    bookingId: string,
    note: string
  ): Promise<BookingDetailResponseDTO | null> {
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    if (booking?.bookingStatus == 'cancelled') {
      throw new AppError(HttpStatus.CONFLICT, 'booking alreaday cancelled');
    }
    const bkg = await this._bookingRepo.confirmBookingByAdmin(bookingId, note);

    const userId = booking.userId.toString();
    const bookingMessage = `Admin Confirmed your Bokoking`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.USER,
      userId: userId.toString(),
      title: 'Booking Confirmed',
      entityType: EnumNotificationEntityType.BOOKING,
      bookingId: booking?._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: EnumNotificationType.SUCCESS,
      metadata: { bookingId: booking._id },
    });
    return bkg ? BookingMapper.toDetailResponseDTO(bkg) : null;
  }

  async changeTravelDate(
    bookingId: string,
    newDate: Date,
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
          changedBy: 'admin',
          changedAt: new Date(),
        },
        history: {
          action: EnumBookingHistoryAction.DATE_CHANGED,
          oldValue: oldDate,
          newValue: newTravelDate,
          changedBy: 'admin',
          changedAt: new Date(),
          note,
        },
      },
      $inc: { rescheduleCount: 1 },
    });

    return BookingMapper.toDetailResponseDTO(updated!);
  }
}
