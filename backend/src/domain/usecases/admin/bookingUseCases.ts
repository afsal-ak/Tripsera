import { IBookingRepository } from "@domain/repositories/IBookingRepository";
import { IBooking } from "@domain/entities/IBooking";

export class BookingUseCases{
    constructor(private bookingRepo:IBookingRepository){}
async getAllBookings(filters: {
  page: number;
  limit: number;
  packageSearch?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ bookings: IBooking[]; total: number }> {
  return await this.bookingRepo.getAllBooking(filters);
}


async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    return await this.bookingRepo.getBookingById(userId, bookingId)
  }
  
  async getBookingByIdForAdmin( bookingId: string): Promise<IBooking | null> {
    return await this.bookingRepo.getBookingByIdForAdmin( bookingId)
  }
 async cancelBookingByAdmin( bookingId: string, reason: string): Promise<IBooking | null> {
    return await this.bookingRepo.cancelBookingByAdmin(bookingId, reason)
  }

}