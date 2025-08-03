import { IReview } from "@domain/entities/IReview";
import { PaginationInfo } from "@application/dtos/PaginationDto";

export interface IAdminReviewUseCases {
  getAllReviews(page: number, limit: number): Promise<{
    review: IReview[];
   pagination:PaginationInfo
  }>;
   changeReviewStatus(reviewId: string, isBlocked: boolean): Promise<IReview | null>;
  deleteReview(reviewId: string): Promise<boolean>;
    getReviewById(reviewId: string): Promise<IReview | null>;

}
