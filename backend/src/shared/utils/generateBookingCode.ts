import { BookingModel } from "@infrastructure/models/Booking";

export async function generateBookingCode(): Promise<string> {
      const prefix = "TRVL"; 
  const year = new Date().getFullYear();

  // Get number of bookings made this year
  const count = await BookingModel.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
    }
  });

  const paddedCount = String(count + 1).padStart(4, "0");  
  return `${prefix}-${year}-${paddedCount}`;  
}
