import { IReview } from "@domain/entities/IReview";
import { CreateReviewDTO } from "@application/dtos/ReviewDTO";

export interface IReviewUseCases {
    createReview(data: CreateReviewDTO): Promise<IReview>
    getUserReview(
        userId: string,
        page: string,
        limit: string
    ): Promise<{ data: IReview[], total: number; page: number; totalPage: number }>
    getPackageReviews(
        packageId: string,
        page: number,
        limit: number
    ): Promise<{ data: IReview[]; total: number; page: number; totalPages: number }>;

}