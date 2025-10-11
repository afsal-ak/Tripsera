import { IReview } from '@domain/entities/IReview';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IFilter } from '../../../domain/entities/IFilter';
import { ReviewResponseDTO,ReviewTableDTO } from '@application/mappers/ReviewMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export interface IAdminReviewUseCases {
  getAllReviews(
    page: number,
    limit: number,
    filters?:IFilter
  ): Promise<IPaginatedResult<ReviewTableDTO>>
   
  changeReviewStatus(reviewId: string, isBlocked: boolean): Promise<ReviewResponseDTO | null>;
  deleteReview(reviewId: string): Promise<boolean>;
  getReviewById(reviewId: string): Promise<ReviewResponseDTO | null>;
}
