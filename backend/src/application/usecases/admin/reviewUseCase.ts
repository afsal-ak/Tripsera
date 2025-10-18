import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { ReviewMapper, ReviewResponseDTO, ReviewTableDTO } from '@application/mappers/ReviewMapper';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewUseCases implements IAdminReviewUseCases {
  constructor(private _reviewRepo: IReviewRepository) {}

  async getAllReviews(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<ReviewTableDTO>> {
    const result = await this._reviewRepo.findAllReviews(page, limit, filters);
    console.log(result, 'in usecases');

    return {
      data: result.review.map(ReviewMapper.toTableDTO),
      pagination: result.pagination,
    };
  }

  async getReviewById(reviewId: string): Promise<ReviewResponseDTO | null> {
    const review = await this._reviewRepo.findReviewById(reviewId);
    return review ? ReviewMapper.toResponseDTO(review) : null;
  }

  async changeReviewStatus(
    reviewId: string,
    isBlocked: boolean
  ): Promise<ReviewResponseDTO | null> {
    const updatedReview = await this._reviewRepo.update(reviewId, { isBlocked });
    return updatedReview ? ReviewMapper.toResponseDTO(updatedReview) : null;
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    return await this._reviewRepo.delete(reviewId);
  }
}
