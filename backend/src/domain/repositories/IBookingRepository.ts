import { IBooking } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';
export interface IBookingRepository {
  getAllBooking(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: IBooking[]; total: number }>;
  getAllBookingOfUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: IBooking[]; total: number }>;
  getBookingById(userId: string, bookingId: string): Promise<IBooking | null>;
  findOneByUserAndPackage(userId: string, packageId: string): Promise<IBooking | null>;

  getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null>;

  cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null>;
  cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null>;
  createBooking(userId: string, data: IBookingInput): Promise<IBooking>;

  updateBooking(id: string, updateData: Partial<IBooking>): Promise<IBooking | null>;

  findByRazorpayOrderId(orderId: string): Promise<IBooking | null>;
}
