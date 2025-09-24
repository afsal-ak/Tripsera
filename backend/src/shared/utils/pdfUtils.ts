import PDFDocument from 'pdfkit-table';
import { IBooking } from '@domain/entities/IBooking';
import { ISalesReportSummary } from '@domain/entities/ISalesReportSummary';

export const exportSalesReportPDF = async (
  bookings: IBooking[],
  summary: ISalesReportSummary
): Promise<Buffer> => {
  return new Promise((resolve) => {
const doc = new PDFDocument({ margin: 30, size: 'A3', layout: 'landscape' });
    const chunks: any[] = [];

    doc.on('data', (chunk: any) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Title
    doc.fontSize(18).text('Sales Report', { align: 'center' });
    doc.moveDown();

    // Table Data
    const tableData = {
      headers: [
        'Booking Code',
        'User Name',
        'Package Code',
        'Traveler Count',
        'Booking Date',
        'Travel Date',
        'Payment Method',
        'Online Paid',
        'Wallet Used',
        'Discount',
        'Final Paid',
        'Booking Status',
        'Payment Status',
      ],
      rows: bookings.map((b) => {
        const walletUsed = b.walletUsed || b.walletAmountUsed || 0;

        const onlinePaid =
          b.paymentMethod === 'razorpay' || b.paymentMethod === 'wallet+razorpay'
            ? b.amountPaid
            : 0;

        return [
          b.bookingCode,
          b.contactDetails?.name || (b.userId as any)?.username || '',
          (b.packageId as any)?.packageCode || '',
          b.travelers?.length || 0,
          b.bookedAt ? formatDate(b.bookedAt) : formatDate(b.createdAt),
          b.travelDate ? formatDate(b.travelDate) : '',
          b.paymentMethod,
          onlinePaid,
          walletUsed,
          b.discount || 0,
          onlinePaid + walletUsed,
          b.bookingStatus,
          b.paymentStatus,
        ];
      }),
    };

    // Table Styling
    // @ts-ignore
    doc.table(tableData, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
      prepareRow: (_row, _i) => doc.font('Helvetica').fontSize(8),
      columnSpacing: 5,
      columnsSize: [
        90,  // Booking Code
        120, // User Name
        100, // Package Code
        70,  // Traveler Count
        90,  // Booking Date
        90,  // Travel Date
        100, // Payment Method
        80,  // Online Paid
        80,  // Wallet Used
        80,  // Discount
        90,  // Final Paid
        100, // Booking Status
        100, // Payment Status
      ],
    });

    // Summary Section
    doc.moveDown();
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total Bookings: ${summary.totalBookings}`);
    doc.text(`Total Discount: ${summary.totalDiscount}`);
    doc.text(`Total Wallet Used: ${summary.totalWalletUsed}`);
    doc.text(`Total Online Paid: ${summary.totalOnlinePaid}`);
    doc.text(`Total Revenue: ${summary.totalRevenue}`);

    doc.end();
  });
};

const formatDate = (date: Date) =>
  new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
