import { BaseRepository } from "./BaseRepository";
import { IReviewRepository } from "@domain/repositories/IReviewRepository";
import { IReview } from "@domain/entities/IReview";
import { ReviewModel } from "@infrastructure/models/Review";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import mongoose, { SortOrder, Types, } from "mongoose";
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(ReviewModel);
    }

    async findPackageReviews(
        packageId: string,
        page: number,
        limit: number,
        sort: 'newest' | 'oldest' = 'newest'
    ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
        const skip = (page - 1) * limit;

        const sortOption: Record<string, SortOrder> =
            sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const [review, total] = await Promise.all([
            ReviewModel.find({ packageId, isBlocked: false })
                .populate({
                    path: 'userId',
                    select: 'username profileImage.url  ',
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            ReviewModel.countDocuments({ packageId, isBlocked: false }),
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
        // sort: 'newest' | 'oldest' = 'newest'
    ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
        const skip = (page - 1) * limit;

        // const sortOption: Record<string, SortOrder> =
        //     sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const [review, total] = await Promise.all([
            ReviewModel.find()
                .populate({
                    path: 'userId',
                    select: 'username profileImage.url  ',
                })
                .populate({
                    path: 'packageId',
                    select: 'title  ',
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ReviewModel.countDocuments(),
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
            .populate('userId','username email')
            .populate('packageId','title ')
            .lean();
        return review
    }

    async findUserReviewedAlready(userId: string, packageId: string): Promise<IReview | null> {
        return await ReviewModel.findOne({ userId: userId, packageId: packageId });
    }
    async toggleBlockStatus(id: string, isBlocked: boolean): Promise<IReview | null> {
        return await this.model.findByIdAndUpdate(
            id,
            { isBlocked },
            { new: true }
        ).lean();
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
                },
            },
        ]);

        return result[0] || { averageRating: 0, totalReviews: 0 };
    }


}