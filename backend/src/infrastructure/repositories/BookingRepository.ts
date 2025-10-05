import { IBooking } from '@domain/entities/IBooking';
import { IBookingInput } from '@domain/entities/IBookingInput';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { BookingModel } from '@infrastructure/models/Booking';
import { BaseRepository } from './BaseRepository';

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {

  constructor(){
    super(BookingModel)
  }

  async getAllBooking({
    page,
    limit,
    packageSearch,
    status,
    startDate,
    endDate,
  }: {
    page: number;
    limit: number;
    packageSearch?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ bookings: IBooking[]; total: number }> {
    const skip = (page - 1) * limit;
    const match: any = {};

    // Status filter
    if (status && status !== 'all') {
      match.bookingStatus = status;
    }

    // Date range filter
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Initial query
    const aggregatePipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'package',
        },
      },
      { $unwind: '$package' },
    ];

    // Package search
    if (packageSearch) {
      aggregatePipeline.push({
        $match: {
          $or: [
            { 'package.title': { $regex: packageSearch, $options: 'i' } },
            { 'package.location': { $regex: packageSearch, $options: 'i' } },
            { 'package.category': { $regex: packageSearch, $options: 'i' } },
          ],
        },
      });
    }

    // Count first
    const totalResult = await BookingModel.aggregate([...aggregatePipeline, { $count: 'total' }]);
    const total = totalResult[0]?.total || 0;

    // Add pagination and sorting
    aggregatePipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          bookingStatus: 1,
          createdAt: 1,
          totalAmount: 1,
          amountPaid: 1,
          bookedAt: 1,
          travelers: 1,
          packageId: '$package._id',
          packageTitle: '$package.title',
          packageImage: { $arrayElemAt: ['$package.imageUrls', 0] },
        },
      }
    );

    const bookings = await BookingModel.aggregate(aggregatePipeline);

    return { bookings, total };
  }

  async getAllBookingOfUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find({ userId })
        .populate('packageId', 'title imageUrls ')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      BookingModel.countDocuments({ userId }),
    ]);
    return { bookings, total };
  }

  async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({
      _id: bookingId,
      userId: userId,
    })
      .populate('packageId', 'title imageUrls price travelDate packageCode')
       .populate('userId')
      .lean();

    return booking ? booking : null;
  }
  async findOneByUserAndPackage(userId: string, packageId: string): Promise<IBooking | null> {
    return await BookingModel.findOne({
      userId: userId,
      packageId: packageId,
      paymentStatus: 'paid',
    });
  }

  async getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({ _id: bookingId })
      .populate('packageId', 'title imageUrls price travelDate packageCode ')
      .populate('userId', 'email username')
      .lean();

    return booking ? booking : null;
  }

  async cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId, userId },
      {
        bookingStatus: 'cancelled',
        cancelledBy:'user',
        cancelReason: reason,
        cancelledAt: new Date(),
      },
      { new: true, lean: true }
    );

    return booking ? booking : null;
  }

  async cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: 'cancelled',
         cancelledBy:'admin',
        cancelReason: reason,
        cancelledAt: new Date(),
      },
      { new: true, lean: true }
    );

    return booking ? booking : null;
  }
async confirmBookingByAdmin(
  bookingId: string,
  note?: string
): Promise<IBooking | null> {
  const booking = await BookingModel.findOneAndUpdate(
    { _id: bookingId },
    {
      bookingStatus: 'confirmed',
      confirmedBy: 'admin',
      confirmedAt: new Date(),
      adminNote: note || null,
    },
    { new: true, lean: true }
  );

  return booking ? booking : null;
}

  async createBooking(userId: string, data: IBookingInput): Promise<IBooking> {
   
    const newBooking = await BookingModel.create({ userId, ...data });
    return newBooking.toObject();
  }

  async updateBooking(id: string, updateData: Partial<IBooking>): Promise<IBooking | null> {
    return BookingModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByRazorpayOrderId(orderId: string): Promise<IBooking | null> {
    return BookingModel.findOne({ 'razorpay.orderId': orderId });
  } 
  async save(booking: any): Promise<IBooking> {
    return booking.save();
  }

}
