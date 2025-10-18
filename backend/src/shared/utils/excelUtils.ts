import ExcelJS from 'exceljs';
import { IBooking } from '@domain/entities/IBooking';
import { ISalesReportSummary } from '@domain/entities/ISalesReportSummary';

export const exportSalesReportExcel = async (
  bookings: IBooking[],
  summary: ISalesReportSummary
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Define column headers
  worksheet.columns = [
    { header: 'Booking ID', key: 'bookingCode', width: 20 },
    { header: 'User Name', key: 'username', width: 25 },
    { header: 'Package Code', key: 'packageCode', width: 30 },
    { header: 'Traveler Count', key: 'travelerCount', width: 20 },
    { header: 'Booking Date', key: 'bookedAt', width: 20 },
    { header: 'Travel Date', key: 'travelDate', width: 20 },
    { header: 'Payment Method', key: 'paymentMethod', width: 20 },
    { header: 'Online Paid', key: 'onlinePaid', width: 15 },
    { header: 'Wallet Used', key: 'walletUsed', width: 15 },
    { header: 'Discount', key: 'discount', width: 15 },
    { header: 'Final Paid Amount', key: 'finalPaidAmount', width: 20 },
    { header: 'Booking Status', key: 'bookingStatus', width: 20 },
    { header: 'Payment Status', key: 'paymentStatus', width: 20 },
  ];

  // Add booking rows
  bookings.forEach((booking) => {
    const walletUsed = booking.walletAmountUsed || 0;

    // if razorpay or wallet+razorpay then amountPaid = online portion
    const onlinePaid =
      booking.paymentMethod === 'razorpay' || booking.paymentMethod === 'wallet+razorpay'
        ? booking.amountPaid
        : 0;

    worksheet.addRow({
      bookingCode: booking.bookingCode,
      username: booking.contactDetails?.name || (booking.userId as any)?.username || '',
      packageCode: (booking.packageId as any)?.packageCode || '',
      travelerCount: booking.travelers?.length || 0,

      bookedAt: booking.bookedAt ? formatDate(booking.bookedAt) : formatDate(booking.createdAt),
      travelDate: booking.travelDate ? formatDate(booking.travelDate) : '',
      paymentMethod: booking.paymentMethod,
      onlinePaid,
      walletUsed,
      discount: booking.discount || 0,
      finalPaidAmount: onlinePaid + walletUsed,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
    });
  });

  // Add summary section
  worksheet.addRow([]);
  worksheet.addRow(['Summary']);
  worksheet.addRow(['Total Bookings', summary.totalBookings]);
  worksheet.addRow(['Total Discount', summary.totalDiscount]);
  worksheet.addRow(['Total Wallet Used', summary.totalWalletUsed]);
  worksheet.addRow(['Total Online Paid', summary.totalOnlinePaid]);
  worksheet.addRow(['Total Revenue', summary.totalRevenue]);

  // Create buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

// Utility to format date
const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
};
