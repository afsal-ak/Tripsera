// import { IBooking } from '@domain/entities/IBooking';
//  import { BookingTableResponseDTO,BookingDetailResponseDTO } from '@application/dtos/BookingDTO';

// export interface IBookingUseCases {
//   // getAllBookings(filters: {
//   //   page: number;
//   //   limit: number;
//   //   packageSearch?: string;
//   //   status?: string;
//   //   startDate?: string;
//   //   endDate?: string;
//   // }): Promise<{ bookings: IBooking[]; total: number }>;
//   getAllBookings(filters: {
//     page: number;
//     limit: number;
//     packageSearch?: string;
//     status?: string;
//     startDate?: string;
//     endDate?: string;
//   }): Promise<{ bookings: BookingTableResponseDTO[]; total: number }>;

//   getBookingById(userId: string, bookingId: string): Promise<IBooking | null>;

//   getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null>;

//   cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null>;
//   confirmBookingByAdmin(bookingId: string, note: string): Promise<IBooking | null>;
// }
 

import { IBooking } from '@domain/entities/IBooking';
import { BookingTableResponseDTO,BookingDetailResponseDTO } from '@application/dtos/BookingDTO';

export interface IBookingUseCases {
  getAllBookings(filters: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: BookingTableResponseDTO[]; total: number }>;

  getBookingById(userId: string, bookingId: string): Promise<BookingDetailResponseDTO | null>;

  getBookingByIdForAdmin(bookingId: string): Promise<BookingDetailResponseDTO | null>;

  cancelBookingByAdmin(bookingId: string, reason: string): Promise<BookingDetailResponseDTO | null>;
  confirmBookingByAdmin(bookingId: string, note: string): Promise<BookingDetailResponseDTO | null>;
}
 