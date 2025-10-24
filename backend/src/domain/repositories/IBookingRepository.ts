import { IBooking } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';
import { IBaseRepository } from './IBaseRepository';
import { IBookingTable } from '@domain/entities/IBookingTable';
import { IBookingPopulatedForUser } from '@infrastructure/db/types.ts/IBookingPopulated';
export interface IBookingRepository extends IBaseRepository<IBooking> {
  getAllBooking(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: IBookingTable[]; total: number }>;
  getAllBookingOfUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: IBookingPopulatedForUser[]; total: number }>;
  getBookingById(userId: string, bookingId: string): Promise<IBooking | null>;
     findOne(query: Partial<IBooking>): Promise<IBooking | null> 
   
  findOneByUserAndPackage(userId: string, packageId: string): Promise<IBooking | null>;

  getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null>;

  cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null>;
  cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null>;
  createBooking(userId: string, data: IBookingInput): Promise<IBooking>;
  confirmBookingByAdmin(bookingId: string, note?: string): Promise<IBooking | null>;
  updateBooking(id: string, updateData: Partial<IBooking>): Promise<IBooking | null>;

  findByRazorpayOrderId(orderId: string): Promise<IBooking | null>;
  save(booking: any): Promise<IBooking>;
  updateById(id: string, update: any): Promise<IBooking | null>;
}
