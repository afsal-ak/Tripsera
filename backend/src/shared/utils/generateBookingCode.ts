import { BookingModel } from '@infrastructure/models/Booking';

export async function generateBookingCode(): Promise<string> {
  const prefix = 'TRVL';
  const year = new Date().getFullYear();

  // Get the last booking of the current year
  const lastBooking = await BookingModel.findOne({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    },
  })
    .sort({ createdAt: -1 })
    .lean();

  let nextSeq = 1;

  if (lastBooking && lastBooking.bookingCode) {
    const parts = lastBooking.bookingCode.split('-');  
    const lastSeq = parseInt(parts[2], 10);
    nextSeq = lastSeq + 1;
  }

  const paddedSeq = String(nextSeq).padStart(4, '0');
  return `${prefix}-${year}-${paddedSeq}`;
}

// import { BookingModel } from '@infrastructure/models/Booking';

// export async function generateBookingCode(): Promise<string> {
//   const prefix = 'TRVL';
//   const year = new Date().getFullYear();

//   // Get number of bookings made this year
//   const count = await BookingModel.countDocuments({
//     createdAt: {
//       $gte: new Date(`${year}-01-01T00:00:00.000Z`),
//       $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
//     },
//   });

//   const paddedCount = String(count + 1).padStart(4, '0');
//   return `${prefix}-${year}-${paddedCount}`;
// }
