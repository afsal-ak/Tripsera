import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IReview } from '@domain/entities/IReview';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';

export class ReviewUseCases implements IAdminReviewUseCases {

  constructor(private _reviewRepo: IReviewRepository) {}

  async getAllReviews(
    page: number,
    limit: number,
    sort?: string
  ): Promise<{
    review: IReview[];
    pagination: PaginationInfo;
  }> {
    return await this._reviewRepo.findAllReviews(page, limit);
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return await this._reviewRepo.findReviewById(reviewId);
  }
  async changeReviewStatus(reviewId: string, isBlocked: boolean): Promise<IReview | null> {
    return await this._reviewRepo.update(reviewId, { isBlocked });
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    return await this._reviewRepo.delete(reviewId);
  }
}
