import { EnumBookingStatus } from '@constants/enum/bookingEnum';
import { EnumPaymentStatus } from '@constants/enum/paymentEnum';
import { TravelerDTO } from '@application/dtos/BookingDTO';

export interface IBookingTable {
  _id: string;
  bookingCode: string;
  userId: string;
  packageId: string;
  packageTitle?: string;
  packageImage?: string;
  travelers: TravelerDTO[];
  totalAmount: number;
  discount?: number;
  amountPaid: number;
  bookingStatus: EnumBookingStatus;
  paymentStatus: EnumPaymentStatus;
  travelDate?: Date;
  createdAt: Date;
}
