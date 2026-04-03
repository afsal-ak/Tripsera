import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { ReviewMapper, ReviewResponseDTO, ReviewTableDTO } from '@application/mappers/ReviewMapper';
import { ICompanyReviewUseCases } from '@application/useCaseInterfaces/company/IReviewUseCases';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewUseCases implements ICompanyReviewUseCases {
  constructor(private _reviewRepo: IReviewRepository) { }

  async getAllReviews(
    page: number,
    limit: number,
    filters?: IFilter,
    companyId?: string
  ): Promise<IPaginatedResult<ReviewTableDTO>> {
    const result = await this._reviewRepo.findAllReviews(page, limit, filters,companyId);
    console.log(result, 'in usecases');

    return {
      data: result.review.map(ReviewMapper.toTableDTO),
      pagination: result.pagination,
    };
  }

  async getReviewById(reviewId: string, companyId: string): Promise<ReviewResponseDTO | null> {
    const review = await this._reviewRepo.findReviewById(reviewId,companyId);
    return review ? ReviewMapper.toResponseDTO(review) : null;
  }


}
