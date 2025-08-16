import { BookingModel } from '@infrastructure/models/Booking';

export async function generateInvoiceCode(): Promise<string> {
  const prefix = 'INV';
  const year = new Date().getFullYear();

  // Count invoices/bookings for this year
  const count = await BookingModel.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    },
  });

  const paddedCount = String(count + 1).padStart(3, '0');
  return `${prefix}-${year}-${paddedCount}`;
}
