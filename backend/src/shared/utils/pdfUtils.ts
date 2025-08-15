import PDFDocument from 'pdfkit-table';
import { IBooking } from '@domain/entities/IBooking';

export const exportSalesReportPDF = async (bookings: IBooking[], summary: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const chunks: any[] = [];

    doc.on('data', (chunk:any) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text('Sales Report', { align: 'center' });
    doc.moveDown();

    const tableData = {
      headers: [
        'Booking Code', 'Package Code', 'User Name', 'Travelers',
        'Amount Paid', 'Payment Method', 'Payment Status', 'Booking Status',
        'Booked At', 'Travel Date'
      ],
      rows: bookings.map(b => [
        b.bookingCode,
        (b.packageId as any)?.packageCode || '',
        (b.userId as any)?.username || '',
        b.travelers?.map(t => `${t.fullName} (${t.age})`).join(', ') || '',
        b.amountPaid,
        b.paymentMethod,
        b.paymentStatus,
        b.bookingStatus,
        b.bookedAt ? formatDate(b.bookedAt) : '',
        b.travelDate ? formatDate(b.travelDate) : ''
      ])
    };

    // @ts-ignore
    doc.table(tableData, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (_row, _i) => doc.font('Helvetica').fontSize(9),
    });

    doc.moveDown();
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total Amount: ${summary.totalAmount}`);
    doc.text(`Total Discount: ${summary.totalDiscount}`);
    doc.text(`Total Wallet Used: ${summary.totalWalletUsed}`);
    doc.text(`Total Amount Paid: ${summary.totalPaid}`);

    doc.end();
  });
};

const formatDate = (date: Date) => new Date(date).toISOString().split('T')[0];
