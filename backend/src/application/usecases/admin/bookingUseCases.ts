import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IBooking } from '@domain/entities/IBooking';
import { IBookingUseCases } from '@application/useCaseInterfaces/admin/IBookingUseCases';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class BookingUseCases implements IBookingUseCases {
  
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo:IWalletRepository
  ) {}

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
  // async cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null> {
  //   return await this._bookingRepo.cancelBookingByAdmin(bookingId, reason);
  // }

   async cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null> {
      const booking = await this._bookingRepo.findById(bookingId);
      if (!booking) {
        throw new AppError(HttpStatus.NOT_FOUND, 'Booking not found');
      }
  
      if (booking.bookingStatus === 'cancelled') {
        throw new AppError(HttpStatus.OK, 'Booking already cancelled');
      }
  
      const userId=booking.userId
console.log(userId,'id from booking in admin')
      if (booking.paymentStatus === 'paid' && booking.amountPaid > 0) {
        await this._walletRepo.creditWallet(
          userId.toString(),
          booking.amountPaid,
          `Admin: Refund for cancelled booking ${booking.bookingCode}`
        );
      }
  
      return await this._bookingRepo.cancelBookingByAdmin(bookingId, reason);
  
    }
}
