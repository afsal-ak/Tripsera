import { IReview } from '@domain/entities/IReview';
import { CreateReviewDTO } from '@application/dtos/ReviewDTO';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export interface IReviewUseCases {
  createReview(data: CreateReviewDTO): Promise<IReview>;
  getUserReview(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: IReview[]; pagination: PaginationInfo }>;
  //  updateReview(id: string, userId: string, data: UpdateReviewDTO): Promise<IReview | null>;
  deleteReview(reviewId: string, userId: string): Promise<boolean>;
  getPackageReviews(
    packageId: string,
    page: number,
    limit: number
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }>;
  getReviewById(reviewId: string): Promise<IReview | null>;
  getRatingSummary(packageId: string): Promise<{ averageRating: number; totalReviews: number }>;
}
