import { IBooking } from "@domain/entities/IBooking";
import { IBookingInput } from "@domain/entities/IBookingInput";
import { IBookingRepository } from "@domain/repositories/IBookingRepository";
import { BookingModel } from "@infrastructure/models/Booking";
import { UserModel } from "@infrastructure/models/User";
export class MongoBookingRepository implements IBookingRepository {
  async getAllBooking(page: number, limit: number): Promise<{ bookings: IBooking[]; total: number; }> {
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      BookingModel.find()
        .populate('packageId', 'title imageUrls')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      BookingModel.countDocuments()
    ])
    return { bookings, total }
  }
  async getAllBookingOfUser(userId: string, page: number, limit: number): Promise<{
    bookings: IBooking[],
    total: number
  }> {
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      BookingModel.find({ userId })
        .populate('packageId', 'title imageUrls ')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      BookingModel.countDocuments({ userId })
    ])
    return { bookings, total }
  }

  async getBookingById(userId: string, bookingId: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({ _id: bookingId, userId: userId })
      .populate('packageId', 'title imageUrls price travelDate ')
      .lean()

    return booking ? booking : null
  }

    async getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOne({ _id: bookingId})
      .populate('packageId', 'title imageUrls price travelDate ')
       .populate('userId','email username')
      .lean()

    return booking ? booking : null
  }

  async cancelBooking(userId: string, bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId, userId },
      { bookingStatus: "cancelled", cancelReason: reason, cancelledAt: new Date() },
      { new: true, lean: true }
    );

    return booking ? booking : null
  }

  async cancelBookingByAdmin(bookingId: string, reason: string): Promise<IBooking | null> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      { bookingStatus: "cancelled", cancelReason: reason, cancelledAt: new Date() },
      { new: true, lean: true }
    );

    return booking ? booking : null
  }

  async createBooking(userId: string, data: IBookingInput): Promise<IBooking> {
    const newBooking = await BookingModel.create({ userId, ...data })
    return newBooking.toObject();

  }

  async updateBooking(id: string, updateData: Partial<IBooking>): Promise<IBooking | null> {
    return BookingModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByRazorpayOrderId(orderId: string): Promise<IBooking | null> {
    return BookingModel.findOne({ 'razorpay.orderId': orderId });
  }
}