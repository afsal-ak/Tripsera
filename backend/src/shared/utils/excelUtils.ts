import ExcelJS from 'exceljs';
import { IBooking } from '@domain/entities/IBooking';

export const exportSalesReportExcel = async (
  bookings: IBooking[],
  summary: {
    totalAmount: number;
    totalPaid: number;
    totalDiscount: number;
    totalWalletUsed: number;
  }
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Define column headers
  worksheet.columns = [
    { header: 'Booking Code', key: 'bookingCode', width: 20 },
    { header: 'Package Code', key: 'packageCode', width: 30 },
    { header: 'User Name', key: 'username', width: 30 },
    { header: 'Travelers', key: 'travelers', width: 30 },
    { header: 'Amount Paid', key: 'amountPaid', width: 15 },
    { header: 'Payment Method', key: 'paymentMethod', width: 20 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    { header: 'Booking Status', key: 'bookingStatus', width: 15 },
    { header: 'Booked At', key: 'bookedAt', width: 20 },
    { header: 'Travel Date', key: 'travelDate', width: 20 },
  ];

  // Add data rows
  bookings.forEach((booking) => {
    worksheet.addRow({
      bookingCode: booking.bookingCode,
      packageCode: (booking.packageId as any)?.packageCode || '',
      username: (booking.userId as any)?.username || '',
      travelers: booking.travelers?.map((t) => `${t.fullName} (${t.age})`).join(', ') || '',
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      bookedAt: booking.bookedAt ? formatDate(booking.bookedAt) : '',
      travelDate: booking.travelDate ? formatDate(booking.travelDate) : '',
    });
  });
  worksheet.addRow([]);
  worksheet.addRow(['Summary']);
  worksheet.addRow(['Total Amount ', summary.totalAmount]);
  worksheet.addRow(['Total Discount', summary.totalDiscount]);
  worksheet.addRow(['Total Wallet Used', summary.totalWalletUsed]);
  worksheet.addRow(['Total Amount Paid', summary.totalPaid]);

  // Create buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

// Utility to format date
const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
};
