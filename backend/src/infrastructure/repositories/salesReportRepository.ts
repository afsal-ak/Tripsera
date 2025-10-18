import { IBooking } from '@domain/entities/IBooking';
import { BookingModel } from '@infrastructure/models/Booking';
import { FilterQuery } from 'mongoose';
import { IBookingPopulatedForReport } from '@infrastructure/db/types.ts/ISalesReportPopulated';
import { ISalesReportRepository } from '@domain/repositories/ISalesReportRepository';
interface FindOptions {
  skip?: number;
  limit?: number;
  sort?: any;
}

export class SalesReportRepository implements ISalesReportRepository {
  async count(filter: FilterQuery<IBooking>): Promise<number> {
    const baseFilter = {
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    };
    return BookingModel.countDocuments({ ...filter, ...baseFilter });
  }

  async find(
    filter: FilterQuery<IBooking>,
    options: FindOptions = {}
  ): Promise<IBookingPopulatedForReport[]> {
    const baseFilter = {
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    };

    const booking = BookingModel.find({ ...filter, ...baseFilter })
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || {})
      .populate({
        path: 'userId',
        select: 'username',
      })
      .populate({
        path: 'packageId',
        select: 'title packageCode',
      })
      //.lean();
      .lean<IBookingPopulatedForReport[]>();
    return booking;
  }
  async findForReport(
    filter: FilterQuery<IBooking>,
    options: FindOptions = {}
  ): Promise<IBooking[]> {
    const baseFilter = {
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    };

    return BookingModel.find({ ...filter, ...baseFilter })
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || {})
      .populate({
        path: 'userId',
        select: 'username',
      })
      .populate({
        path: 'packageId',
        select: 'title packageCode',
      })
      .lean();
  }

  async calculateSummary(filter: any) {
    const baseFilter = {
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    };

    const result = await BookingModel.aggregate([
      { $match: { ...filter, ...baseFilter } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalOnlinePaid: { $sum: '$amountPaid' },
          totalWalletUsed: { $sum: '$walletAmountUsed' },
          totalDiscount: { $sum: '$discount' },
          totalRevenue: {
            $sum: {
              $add: [{ $ifNull: ['$amountPaid', 0] }, { $ifNull: ['$walletAmountUsed', 0] }],
            },
          },
        },
      },
    ]);

    return (
      result[0] || {
        totalBookings: 0,
        totalOnlinePaid: 0,
        totalWalletUsed: 0,
        totalDiscount: 0,
        totalRevenue: 0,
      }
    );
  }
}
