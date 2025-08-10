import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IReview } from '@domain/entities/IReview';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewUseCases implements IAdminReviewUseCases {

  constructor(private _reviewRepo: IReviewRepository) {}

  async getAllReviews(
    page: number,
    limit: number,
     filters?:IFilter
  ): Promise<{
    review: IReview[];
    pagination: PaginationInfo;
  }> {
    return await this._reviewRepo.findAllReviews(page, limit,filters);
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
