import { SalesReportResponseDTO } from '@application/dtos/salesReportDTO';
import { IBookingPopulatedForReport } from '@infrastructure/db/types.ts/ISalesReportPopulated';

export class SalesReportMapper {
  static toResponseDTO(booking: IBookingPopulatedForReport): SalesReportResponseDTO {
    return {
      _id: booking._id?.toString() || '',
      bookingCode: booking.bookingCode,
      username: booking.userId?.username || 'N/A',
      packageTitle: booking.packageId?.title || 'N/A',
      packageCode: booking.packageId?.packageCode || 'N/A',
      totalAmount: booking.totalAmount,
      discount: booking.discount ?? 0,
      walletAmountUsed: booking.walletAmountUsed ?? 0,
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      bookedAt: booking.bookedAt,
      createdAt: booking.createdAt,
      travelDate: booking.travelDate,
    };
  }
}
