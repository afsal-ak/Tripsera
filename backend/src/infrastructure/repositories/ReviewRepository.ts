import { BaseRepository } from './BaseRepository';
import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IReview } from '@domain/entities/IReview';
import { ReviewModel } from '@infrastructure/models/Review';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import mongoose, { SortOrder } from 'mongoose';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(ReviewModel);
  }

  async findPackageReviews(
    packageId: string,
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.rating) {
      query.rating = filters.rating
    }

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const sortOption: Record<string, SortOrder> = {};

    // Handle createdAt sorting
    if (filters.sort === 'desc') {
      sortOption.createdAt = -1;
    } else if (filters.sort === 'asc') {
      sortOption.createdAt = 1;
    }

    // Handle rating sorting
    if (filters.sort === 'rating_highest') {
      sortOption.rating = -1;
    } else if (filters.sort === 'rating_lowest') {
      sortOption.rating = 1;
    }

    const [review, total] = await Promise.all([
      ReviewModel.find({ packageId, isBlocked: false, ...query })
        .populate({
          path: 'userId',
          select: 'username profileImage.url  ',
        })
        .populate({
          path: 'packageId',
          select: 'title  ',
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments({ packageId, isBlocked: false, ...query }),
    ]);
 

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { review, pagination };
  }

  async findUserReviews(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: IReview[]; pagination: PaginationInfo }> {
    return this.findAll(page, limit, { userId, isBlocked: false });
  }

  async findAllReviews(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { comment: { $regex: filters.search, $options: "i" } },
        { username: { $regex: filters.search, $options: "i" } },
        { packageTitle: { $regex: filters.search, $options: "i" } }
      ];
    }

    if (filters.status) {
      if (filters.status == 'active') {
        query.isBlocked = false
      } else {
        query.isBlocked = true
      }
    }

    if (filters.rating) {
      query.rating = filters.rating
    }

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const sortOption: Record<string, SortOrder> = {};

    // Handle createdAt sorting
    if (filters.sort === 'desc') {
      sortOption.createdAt = -1;
    } else if (filters.sort === 'asc') {
      sortOption.createdAt = 1;
    }

    // Handle rating sorting
    if (filters.sort === 'rating_highest') {
      sortOption.rating = -1;
    } else if (filters.sort === 'rating_lowest') {
      sortOption.rating = 1;
    }

    const [review, total] = await Promise.all([
      ReviewModel.find(query)
        .populate({
          path: 'userId',
          select: 'username profileImage.url  ',
        })
        .populate({
          path: 'packageId',
          select: 'title  ',
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments(query),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { review, pagination };
  }



  async findReviewById(reviewId: string): Promise<IReview | null> {
    const review = await ReviewModel.findById(reviewId)
      .populate('userId', 'username email')
      .populate('packageId', 'title ')
      .lean();
    return review;
  }

  async findUserReviewedAlready(userId: string, packageId: string): Promise<IReview | null> {
    return await ReviewModel.findOne({ userId: userId, packageId: packageId });
  }
  async toggleBlockStatus(id: string, isBlocked: boolean): Promise<IReview | null> {
    return await this.model.findByIdAndUpdate(id, { isBlocked }, { new: true }).lean();
  }

  async getPackageRatingSummary(packageId: string) {
    const result = await ReviewModel.aggregate([
      {
        $match: {
          packageId: new mongoose.Types.ObjectId(packageId),
          isBlocked: false,
        },
      },
      {
        $group: {
          _id: '$packageId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStar: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
          },
          fourStar: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
          },
          threeStar: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
          },
          twoStar: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
          }
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          fiveStar: 1,
          fourStar: 1,
          threeStar: 1,
          twoStar: 1,
          oneStar: 1
        }
      }
    ]);

    return (
      result[0] || {
        averageRating: 0,
        totalReviews: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0
      }
    );
  }

}
