import { IReview } from "@domain/entities/IReview";

export interface IAdminReviewUseCases {
  blockReview(reviewId: string): Promise<IReview | null>;
  unblockReview(reviewId: string): Promise<IReview | null>;
  deleteReview(reviewId: string): Promise<boolean>;
  getAllReviews(page: number, limit: number): Promise<{
    data: IReview[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
