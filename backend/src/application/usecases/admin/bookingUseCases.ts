import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IBooking } from '@domain/entities/IBooking';
import { IBookingUseCases } from '@application/useCaseInterfaces/admin/IBookingUseCases';

export class BookingUseCases implements IBookingUseCases {
  
  constructor(private _bookingRepo: IBookingRepository) {}

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
    return await this._bookingRepo.cancelBookingByAdmin(bookingId, reason);
  }
}
