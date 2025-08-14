import { IReport, IReportStatus } from "@domain/entities/IReport";
import { IReportRepository } from "@domain/repositories/IReportRepository";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from '@application/dtos/PaginationDto';
import  { SortOrder } from 'mongoose';
import { BaseRepository } from "./BaseRepository";
import { ReportModel } from "@infrastructure/models/Report";
 
export class ReportRepository extends BaseRepository<IReport> implements IReportRepository {
  constructor() {
    super(ReportModel)
  }
  async existingReport(reportedId: string, reporterId: string): Promise<boolean> {
    const existingReport = await ReportModel.findOne({ reportedId, reporterId })
    return !!existingReport
  }

  async findAllReports(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ report: IReport[]; pagination: PaginationInfo; }> {

    const skip = (page - 1) * limit

    const matchStage: any = {}

    if (filters.status) {
      matchStage.status = filters.status
    }

    if (filters.startDate && filters.endDate) {
      matchStage.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      }
    }
    const sortOption: Record<string, SortOrder> = {};

    if (filters.sort === 'asc') {
      sortOption.createdAt = 1
    } else if (filters.sort === 'desc') {
      sortOption.createdAt = -1

    } else {
      sortOption.createdAt = -1
    }

   
     if (filters.customFilter) {
      matchStage.reportedType = filters.customFilter
    }

    const aggregatePipeline: any[] = [
      { $match: matchStage },

      // Who reported
      {
        $lookup: {
          from: 'users',
          localField: 'reporterId',
          foreignField: '_id',
          as: 'reporterUser'
        }
      },
      { $unwind: { path: '$reporterUser', preserveNullAndEmptyArrays: true } },

      // If reportedType = user → get reported user
      {
        $lookup: {
          from: 'users',
          localField: 'reportedId',
          foreignField: '_id',
          as: 'reportedUser'
        }
      },
      { $unwind: { path: '$reportedUser', preserveNullAndEmptyArrays: true } },

      // If reportedType = blog → get blog + blog owner
      {
        $lookup: {
          from: 'blogs',
          localField: 'reportedId',
          foreignField: '_id',
          as: 'reportedBlog'
        }
      },
      { $unwind: { path: '$reportedBlog', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'reportedBlog.author',
          foreignField: '_id',
          as: 'reportedBlogOwner'
        }
      },
      { $unwind: { path: '$reportedBlogOwner', preserveNullAndEmptyArrays: true } },

      // If reportedType = review → get review + review owner
      {
        $lookup: {
          from: 'reviews',
          localField: 'reportedId',
          foreignField: '_id',
          as: 'reportedReview'
        }
      },
      { $unwind: { path: '$reportedReview', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'reportedReview.userId',
          foreignField: '_id',
          as: 'reportedReviewOwner'
        }
      },
      { $unwind: { path: '$reportedReviewOwner', preserveNullAndEmptyArrays: true } }
    ];

    //  search
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      aggregatePipeline.push({
        $match: {
          $or: [
            { 'reporterUser.username': searchRegex },
            { 'reportedUser.username': searchRegex },
            { 'reportedBlogOwner.username': searchRegex },
            { 'reportedReviewOwner.username': searchRegex }
          ]
        }
      });
    }

    // Count
    const totalResult = await ReportModel.aggregate([...aggregatePipeline, { $count: 'total' }]);
    const total = totalResult[0]?.total || 0;

    // Pagination + Projection
    aggregatePipeline.push(
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          reportedType: 1,
          reason: 1,
          description: 1,
          status: 1,
          adminAction: 1,
          createdAt: 1,
          reporterUserName: '$reporterUser.username',
          reportedUserName: '$reportedUser.username',
          blogTitle: '$reportedBlog.title',
          blogOwner: '$reportedBlogOwner.username',
          reviewTitle: '$reportedReview.title',
          reviewOwner: '$reportedReviewOwner.username'
        }
      }
    );

    const report = await ReportModel.aggregate(aggregatePipeline);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
    return { report, pagination };

  }

  async updateReportStatus(id: string, status: IReportStatus): Promise<boolean> {
    const report =await ReportModel.findById(id,status)
    return !!report
  }



}