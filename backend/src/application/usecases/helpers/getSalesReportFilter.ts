import { FilterQuery } from 'mongoose';
import { IBooking } from '@domain/entities/IBooking';

export interface FilterQueryOptions {
  from?: string;
  to?: string;
  day?: string;       
  week?: string;      
  month?: string;    
  year?: string;     
  status?: string;
  paymentMethod?:string
}

export const getSalesReportFilter = (query: FilterQueryOptions): FilterQuery<IBooking> => {
  const filter: FilterQuery<IBooking> = {};

  // Booking Status
  if (query.status) {
    filter.bookingStatus = query.status;
  }
   if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }


  // Custom date range
  if (query.from || query.to) {
    filter.bookedAt = {};
    if (query.from) filter.bookedAt.$gte = new Date(query.from);
    if (query.to) {
      const toDate = new Date(query.to);
      toDate.setHours(23, 59, 59, 999);
      filter.bookedAt.$lte = toDate;
    }
  }

  // Day filter (single date)
  if (query.day) {
    const dayStart = new Date(query.day);
    const dayEnd = new Date(query.day);
    dayEnd.setHours(23, 59, 59, 999);
    filter.bookedAt = { $gte: dayStart, $lte: dayEnd };
  }

  // Week filter (any day within the week)
  if (query.week) {
    const inputDate = new Date(query.week);
    const start = new Date(inputDate);
    const end = new Date(inputDate);
    const day = inputDate.getDay(); // 0 (Sun) to 6 (Sat)

    // Set to Monday
    start.setDate(inputDate.getDate() - ((day + 6) % 7));
    start.setHours(0, 0, 0, 0);

    // Set to Sunday
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    filter.bookedAt = { $gte: start, $lte: end };
  }

  // Month filter
  if (query.month) {
    const [year, month] = query.month.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); // last day of month
    end.setHours(23, 59, 59, 999);

    filter.bookedAt = { $gte: start, $lte: end };
  }

  // Year filter
  if (query.year) {
    const year = parseInt(query.year);
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    end.setHours(23, 59, 59, 999);

    filter.bookedAt = { $gte: start, $lte: end };
  }

  return filter;
};
