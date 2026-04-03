import { IFilter } from '../../../domain/entities/IFilter';
import { ReviewResponseDTO, ReviewTableDTO } from '@application/mappers/ReviewMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export interface ICompanyReviewUseCases {
  getAllReviews(
    page: number,
    limit: number,
    filters?: IFilter,
    companyId?:string
  ): Promise<IPaginatedResult<ReviewTableDTO>>;

  getReviewById(reviewId: string,companyId:string): Promise<ReviewResponseDTO | null>;
}
