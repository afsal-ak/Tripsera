import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
import { UserModel } from '@infrastructure/models/User';
import { PackageModel } from '@infrastructure/models/Package';
import { BookingModel } from '@infrastructure/models/Booking';
import { BlogModel } from '@infrastructure/models/Blog';

import CustomPackage from '@infrastructure/models/CustomPackage';
import { IBookingsChartData, ITopCategory, ITopPackage } from '@application/dtos/DashboardDTO';

export class DashboardRepository implements IDashboardRepository {
  async getTotalUsers(startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    return await UserModel.countDocuments(query);
  }

  async getTotalPackages(startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    return await PackageModel.countDocuments(query);
  }

  async getTotalBookings(startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    return await BookingModel.countDocuments(query);
  }

  async getTotalCustomPlans(startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    return await CustomPackage.countDocuments(query);
  }

  async getTotalBlogs(startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    return await BlogModel.countDocuments(query);
  }

  async getTopBookedPackages(startDate?: Date, endDate?: Date): Promise<ITopPackage[]> {
    const match: any = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: startDate, $lte: endDate };
    }
    const topPkg = await BookingModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$packageId',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$amountPaid' },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },

      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: '_id',
          as: 'packageDetails',
        },
      },
      { $unwind: '$packageDetails' },
      {
        $project: {
          packageId: '$_id',
          packageName: '$packageDetails.title',
          packageImage: { $arrayElemAt: ['$packageDetails.imageUrls.url', 0] },
          totalBookings: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);
     return topPkg;
  }

  async getTopBookedCategories(startDate?: Date, endDate?: Date): Promise<ITopCategory[]> {
    const match: any = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: startDate, $lte: endDate };
    }

    const topCat = await BookingModel.aggregate([
      { $match: match },
      // Join package details
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'packageDetails',
        },
      },
      { $unwind: '$packageDetails' },

      // Unwind categories inside packages
      { $unwind: '$packageDetails.category' },

      // Group by category
      {
        $group: {
          _id: '$packageDetails.category',
          totalBookings: { $sum: 1 },
        },
      },

      // Lookup category details
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },

      // Final
      {
        $project: {
          _id: 0,
          categoryId: '$categoryDetails._id',
          name: '$categoryDetails.name',
          totalBookings: 1,
        },
      },

      // Sort & limit
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },
    ]);
    console.log(topCat, 'top cate');
    return topCat;
  }

  async sgetBookingsChartData(
    startDate?: Date,
    endDate?: Date,
    groupBy?: 'day' | 'month' | 'year'
  ) {
    const matchStage: any = { status: 'confirmed' };

    // If filtering by date range
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lte: endDate };

      // Auto-decide groupBy for custom ranges if not provided
      if (!groupBy) {
        const diffInDays =
          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);

        if (diffInDays <= 31) {
          groupBy = 'day';
        } else if (diffInDays <= 365) {
          groupBy = 'month';
        } else {
          groupBy = 'year';
        }
      }
    } else if (!groupBy) {
      // Default groupBy if no date filter provided
      groupBy = 'month';
    }

    // Set MongoDB date format based on groupBy
    let dateFormat: string;
    if (groupBy === 'day')
      dateFormat = '%d %b'; // e.g., 01 Aug
    else if (groupBy === 'month')
      dateFormat = '%b %Y'; // e.g., Aug 2025
    else dateFormat = '%Y'; // e.g., 2025

    const result = await BookingModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result;
  }

  async getBookingsChartData(
    startDate: Date,
    endDate: Date,
    groupBy: 'hour' | 'day' | 'month' | 'year'
  ): Promise<IBookingsChartData[]> {
    let dateFormat: Record<string, string> = {};

    switch (groupBy) {
      case 'hour':
        dateFormat = { year: '$year', month: '$month', day: '$day', hour: '$hour' };
        break;
      case 'day':
        dateFormat = { year: '$year', month: '$month', day: '$day' };
        break;
      case 'month':
        dateFormat = { year: '$year', month: '$month' };
        break;
      case 'year':
        dateFormat = { year: '$year' };
        break;
    }

    return await BookingModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          bookingStatus: 'confirmed',
        },
      },
      {
        $project: {
          amountPaid: 1,
          createdAt: 1,
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' },
        },
      },
      {
        $group: {
          _id: dateFormat,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$amountPaid' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 },
      },
    ]);
  }
}
