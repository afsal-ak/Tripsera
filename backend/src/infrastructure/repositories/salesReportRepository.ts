

import { IBooking } from "@domain/entities/IBooking";
import { BookingModel } from "@infrastructure/models/Booking";
import { SalesReportFilterDTO } from "@application/dtos/salesReportDTO";
import { FilterQuery } from 'mongoose';
import { FilterQueryOptions } from "@application/usecases/helpers/getSalesReportFilter";

interface FindOptions {
  skip?: number;
  limit?: number;
  sort?: any;
}

export class SalesReportRepository {
  async count(filter: FilterQuery<IBooking>): Promise<number> {
    return BookingModel.countDocuments(filter);
  }

  async find(filter: FilterQuery<IBooking>, options: FindOptions = {}): Promise<IBooking[]> {
    return BookingModel.find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || {})
      .populate({
        path: 'userId',
        select: 'username'
      })
       .populate({
        path: 'packageId',
        select: 'packageCode'
      })
      
      .lean();
  }

  async calculateSummary(filter: any) {
    const result = await BookingModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amountPaid" },
          totalDiscount: { $sum: "$discount" },
          totalWalletUsed: { $sum: "$walletUsed" },
          totalAmount: { $sum: "$totalAmount" },
        }
      }
    ]);

    return result[0] || {
      totalPaid: 0,
      totalDiscount: 0,
      totalWalletUsed: 0,
      totalCouponUsed: 0
    };
  }

}
