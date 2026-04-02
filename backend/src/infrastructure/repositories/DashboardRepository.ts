import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
import { UserModel } from '@infrastructure/models/User';
import { PackageModel } from '@infrastructure/models/Package';
import { BookingModel } from '@infrastructure/models/Booking';
import { BlogModel } from '@infrastructure/models/Blog';
import CustomPackage from '@infrastructure/models/CustomPackage';
import {
  IBookingsChartData,
  IHomeTopPackage,
  ITopCategory,
  ITopPackage,
} from '@application/dtos/DashboardDTO';
import { Types } from 'mongoose';
import { EnumPackageType } from '@constants/enum/packageEnum';

export class DashboardRepository implements IDashboardRepository {

  //  COMMON MATCH BUILDER
  private buildMatch(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ) {
    const match: any = {};

    if (startDate && endDate) {
      match.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (companyId) {
      match.companyId = new Types.ObjectId(companyId);
    }

    return match;
  }

  async getTotalUsers(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number> {
    const query = this.buildMatch(startDate, endDate, companyId);
    return await UserModel.countDocuments(query);
  }

  async getTotalPackages(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number> {
    const query = this.buildMatch(startDate, endDate, companyId);
    return await PackageModel.countDocuments(query);
  }

  async getTotalBookings(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number> {
    const query = this.buildMatch(startDate, endDate, companyId);
    return await BookingModel.countDocuments(query);
  }

  async getTotalCustomPlans(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number> {
    const query = this.buildMatch(startDate, endDate, companyId);
    return await CustomPackage.countDocuments(query);
  }

  async getTotalBlogs(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<number> {
    const query = this.buildMatch(startDate, endDate, companyId);
    return await BlogModel.countDocuments(query);
  }

  async getTopBookedPackages(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<ITopPackage[]> {
    const match = this.buildMatch(startDate, endDate, companyId);

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

      // 🔥 IMPORTANT: filter package by company also
      ...(companyId
        ? [
            {
              $match: {
                'packageDetails.companyId': new Types.ObjectId(companyId),
              },
            },
          ]
        : []),

      {
        $project: {
          packageId: '$_id',
          packageName: '$packageDetails.title',
          packageImage: {
            $arrayElemAt: ['$packageDetails.imageUrls.url', 0],
          },
          totalBookings: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);

    return topPkg;
  }

  async getTopBookedCategories(
    startDate?: Date,
    endDate?: Date,
    companyId?: string
  ): Promise<ITopCategory[]> {
    const match = this.buildMatch(startDate, endDate, companyId);

    const topCat = await BookingModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'packageDetails',
        },
      },
      { $unwind: '$packageDetails' },

      // 🔥 filter company
      ...(companyId
        ? [
            {
              $match: {
                'packageDetails.companyId': new Types.ObjectId(companyId),
              },
            },
          ]
        : []),

      { $unwind: '$packageDetails.category' },
      {
        $group: {
          _id: '$packageDetails.category',
          totalBookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          _id: 0,
          categoryId: '$categoryDetails._id',
          name: '$categoryDetails.name',
          totalBookings: 1,
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },
    ]);

    return topCat;
  }

  async getBookingsChartData(
    startDate: Date,
    endDate: Date,
    groupBy: 'hour' | 'day' | 'month' | 'year',
    companyId?: string
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

    const match = {
      ...this.buildMatch(startDate, endDate, companyId),
      bookingStatus: 'confirmed',
    };

    return await BookingModel.aggregate([
      { $match: match },
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
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.hour': 1,
        },
      },
    ]);
  }


// import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
// import { UserModel } from '@infrastructure/models/User';
// import { PackageModel } from '@infrastructure/models/Package';
// import { BookingModel } from '@infrastructure/models/Booking';
// import { BlogModel } from '@infrastructure/models/Blog';

// import CustomPackage from '@infrastructure/models/CustomPackage';
// import { IBookingsChartData, ITopCategory, ITopPackage,IHomeTopPackage } from '@application/dtos/DashboardDTO';
// import { EnumPackageType } from '@constants/enum/packageEnum';

// export class DashboardRepository implements IDashboardRepository {
//   async getTotalUsers(startDate?: Date, endDate?: Date): Promise<number> {
//     const query: any = {};
//     if (startDate && endDate) {
//       query.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     return await UserModel.countDocuments(query);
//   }

//   async getTotalPackages(startDate?: Date, endDate?: Date): Promise<number> {
//     const query: any = {};
//     if (startDate && endDate) {
//       query.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     return await PackageModel.countDocuments(query);
//   }

//   async getTotalBookings(startDate?: Date, endDate?: Date): Promise<number> {
//     const query: any = {};
//     if (startDate && endDate) {
//       query.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     return await BookingModel.countDocuments(query);
//   }

//   async getTotalCustomPlans(startDate?: Date, endDate?: Date): Promise<number> {
//     const query: any = {};
//     if (startDate && endDate) {
//       query.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     return await CustomPackage.countDocuments(query);
//   }

//   async getTotalBlogs(startDate?: Date, endDate?: Date): Promise<number> {
//     const query: any = {};
//     if (startDate && endDate) {
//       query.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     return await BlogModel.countDocuments(query);
//   }

//   async getTopBookedPackages(startDate?: Date, endDate?: Date): Promise<ITopPackage[]> {
//     const match: any = {};
//     if (startDate && endDate) {
//       match.createdAt = { $gte: startDate, $lte: endDate };
//     }
//     const topPkg = await BookingModel.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: '$packageId',
//           totalBookings: { $sum: 1 },
//           totalRevenue: { $sum: '$amountPaid' },
//         },
//       },
//       { $sort: { totalBookings: -1 } },
//       { $limit: 10 },

//       {
//         $lookup: {
//           from: 'packages',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'packageDetails',
//         },
//       },
//       { $unwind: '$packageDetails' },
//       {
//         $project: {
//           packageId: '$_id',
//           packageName: '$packageDetails.title',
//           packageImage: { $arrayElemAt: ['$packageDetails.imageUrls.url', 0] },
//           totalBookings: 1,
//           totalRevenue: 1,
//           _id: 0,
//         },
//       },
//     ]);
//      return topPkg;
//   }

//   async getTopBookedCategories(startDate?: Date, endDate?: Date): Promise<ITopCategory[]> {
//     const match: any = {};
//     if (startDate && endDate) {
//       match.createdAt = { $gte: startDate, $lte: endDate };
//     }

//     const topCat = await BookingModel.aggregate([
//       { $match: match },
//       // Join package details
//       {
//         $lookup: {
//           from: 'packages',
//           localField: 'packageId',
//           foreignField: '_id',
//           as: 'packageDetails',
//         },
//       },
//       { $unwind: '$packageDetails' },

//       // Unwind categories inside packages
//       { $unwind: '$packageDetails.category' },

//       // Group by category
//       {
//         $group: {
//           _id: '$packageDetails.category',
//           totalBookings: { $sum: 1 },
//         },
//       },

//       // Lookup category details
//       {
//         $lookup: {
//           from: 'categories',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'categoryDetails',
//         },
//       },
//       { $unwind: '$categoryDetails' },

//       // Final
//       {
//         $project: {
//           _id: 0,
//           categoryId: '$categoryDetails._id',
//           name: '$categoryDetails.name',
//           totalBookings: 1,
//         },
//       },

//       // Sort & limit
//       { $sort: { totalBookings: -1 } },
//       { $limit: 10 },
//     ]);
//     console.log(topCat, 'top cate');
//     return topCat;
//   }

   
//   async getBookingsChartData(
//     startDate: Date,
//     endDate: Date,
//     groupBy: 'hour' | 'day' | 'month' | 'year'
//   ): Promise<IBookingsChartData[]> {
//     let dateFormat: Record<string, string> = {};

//     switch (groupBy) {
//       case 'hour':
//         dateFormat = { year: '$year', month: '$month', day: '$day', hour: '$hour' };
//         break;
//       case 'day':
//         dateFormat = { year: '$year', month: '$month', day: '$day' };
//         break;
//       case 'month':
//         dateFormat = { year: '$year', month: '$month' };
//         break;
//       case 'year':
//         dateFormat = { year: '$year' };
//         break;
//     }

//     return await BookingModel.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate, $lte: endDate },
//           bookingStatus: 'confirmed',
//         },
//       },
//       {
//         $project: {
//           amountPaid: 1,
//           createdAt: 1,
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' },
//           day: { $dayOfMonth: '$createdAt' },
//           hour: { $hour: '$createdAt' },
//         },
//       },
//       {
//         $group: {
//           _id: dateFormat,
//           totalBookings: { $sum: 1 },
//           totalRevenue: { $sum: '$amountPaid' },
//         },
//       },
//       {
//         $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 },
//       },
//     ]);
//   }


async getTopBookedPackagesForUser(limit = 10): Promise<IHomeTopPackage[]> {
    const today = new Date();

    const topPackages = await BookingModel.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      { $unwind: "$packageDetails" },

      {
        $match: {
          "packageDetails.packageType": {
            $in: [EnumPackageType.NORMAL, EnumPackageType.GROUP],
          },
          "packageDetails.isBlocked": false,
          "packageDetails.endDate": { $gte: today },
        },
      },
      {
        $group: {
          _id: "$packageId",
          totalBookings: { $sum: 1 },
          packageDetails: { $first: "$packageDetails" },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: limit },
    ]);

    return topPackages;
  }
  //  Top booked categories (for homepage category carousel)
  async getTopBookedCategoriesForUser(limit = 10): Promise<ITopCategory[]> {
    const today = new Date();

    const topCategories = await BookingModel.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      { $unwind: "$packageDetails" },
      {
        $match: {
          "packageDetails.packageType": { $in: [EnumPackageType.NORMAL, EnumPackageType.GROUP] },
          "packageDetails.isBlocked": false,
          "packageDetails.endDate": { $gte: today },
        },
      },
      { $unwind: "$packageDetails.category" },
      {
        $group: {
          _id: "$packageDetails.category",
          totalBookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          categoryId: "$categoryInfo._id",
          name: "$categoryInfo.name",
          totalBookings: 1,
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: limit },
    ]);

    return topCategories;
  }
}
