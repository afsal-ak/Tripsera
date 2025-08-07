import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IReview } from '@domain/entities/IReview';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';

export class ReviewUseCases implements IAdminReviewUseCases {
  constructor(private reviewRepo: IReviewRepository) {}

  async getAllReviews(
    page: number,
    limit: number,
    sort?: string
  ): Promise<{
    review: IReview[];
    pagination: PaginationInfo;
  }> {
    return await this.reviewRepo.findAllReviews(page, limit);
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return await this.reviewRepo.findReviewById(reviewId);
  }
  async changeReviewStatus(reviewId: string, isBlocked: boolean): Promise<IReview | null> {
    return await this.reviewRepo.update(reviewId, { isBlocked });
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    return await this.reviewRepo.delete(reviewId);
  }
}
