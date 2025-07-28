import { BaseRepository } from "./BaseRepository";
import { IReviewRepository } from "@domain/repositories/IReviewRepository";
import { IReview } from "@domain/entities/IReview";
import { ReviewModel } from "@infrastructure/models/Review";

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(ReviewModel);
    }
    async findPackageReviews(
        packageId: string,
        page : number,
        limit : number
    ): Promise<{ data: IReview[]; total: number; page: number; totalPages: number }> {
        return this.findAll(page, limit, { packageId, isBlocked: false });
    }

    async findUserReviews(
        userId: string,
        page : number,
        limit : number
    ): Promise<{ data: IReview[]; total: number; page: number; totalPages: number }> {
        return this.findAll(page, limit, { userId });
    }

}