import { IBooking } from '@domain/entities/IBooking';

export interface IBookingUseCases {
  getAllBookings(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: IBooking[]; total: number }>;

  getBookingById(userId: string, bookingId: string): Promise<IBooking | null>;

  getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null>;

  cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null>;
}
