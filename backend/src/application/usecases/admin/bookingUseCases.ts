import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IBooking } from '@domain/entities/IBooking';
import { IBookingUseCases } from '@application/useCaseInterfaces/admin/IBookingUseCases';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';

export class BookingUseCases implements IBookingUseCases {

  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _notificationUseCases: INotificationUseCases
  ) { }

  async getAllBookings(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: IBooking[]; total: number }> {
    return await this._bookingRepo.getAllBooking(filters);
  }

  async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    return await this._bookingRepo.getBookingById(userId, bookingId);
  }

  async getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null> {
    return await this._bookingRepo.getBookingByIdForAdmin(bookingId);
  }

  async cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new AppError(HttpStatus.OK, 'Booking already cancelled');
    }

    const userId = booking.userId.toString()
    //  Refund if already paid
    if (booking.paymentStatus === "paid" && booking.amountPaid > 0) {
      const wallet = await this._walletRepo.creditWallet(
        userId,
        booking.amountPaid,
        `Admin : Refund for cancelled booking ${booking.bookingCode}`
      );

      if (!wallet) {
        throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to refund wallet");
      }

      const walletMessage = `Your payment of ₹${booking.amountPaid} for booking ${booking.bookingCode} has been refunded to your wallet.`;

      await this._notificationUseCases.sendNotification({
        role: "user",
        userId,
        title: "Booking Refund",
        entityType: "wallet",
        walletId: wallet._id!.toString(),
        message: walletMessage,
        type: "success",
      });
    }


    const bookingMessage = `Admin Cancelled your booking  ${booking?.bookingCode} (Reason: ${reason})`;

    await this._notificationUseCases.sendNotification({
      role: 'user',
      userId: userId.toString(),
      title: "Booking Cancelled",
      entityType: 'booking',
      bookingId: booking?._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: "warning",
      metadata: { bookingId: booking._id, reason },
    });


    return await this._bookingRepo.cancelBookingByAdmin(bookingId, reason);

  }

  async confirmBookingByAdmin(bookingId: string, note: string): Promise<IBooking | null> {
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
    }
    if (booking?.bookingStatus == 'cancelled') {
      throw new AppError(HttpStatus.CONFLICT, 'booking alreaday cancelled')
    }
    const bkg = await this._bookingRepo.confirmBookingByAdmin(bookingId, note)


    const userId = booking.userId.toString()
    const bookingMessage = `Admin Confirmed your Bokoking`;

    await this._notificationUseCases.sendNotification({
      role: 'user',
      userId: userId.toString(),
      title: "Booking Confirmed",
      entityType: 'booking',
      bookingId: booking?._id!.toString(),
      packageId: booking.packageId.toString(),
      message: bookingMessage,
      type: "success",
      metadata: { bookingId: booking._id },
    });
    return bkg

  }
}
