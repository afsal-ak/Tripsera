import { IReview } from '@domain/entities/IReview';
import { CreateReviewDTO,UpdateReviewDTO } from '@application/dtos/ReviewDTO';
import { ReviewResponseDTO,UserReviewListDTO } from '@application/mappers/ReviewMapper';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export interface IReviewUseCases {

  createReview(data: CreateReviewDTO): Promise<ReviewResponseDTO>;
  getUserReview(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<UserReviewListDTO>>;
    editReview(reviewId: string, userId: string, data: UpdateReviewDTO): Promise<ReviewResponseDTO >;
  deleteReview(reviewId: string, userId: string): Promise<boolean>;
  getPackageReviews(
    packageId: string,
    page: number,
    limit: number,
    filters?:IFilter
  
  ): Promise<IPaginatedResult<ReviewResponseDTO>>;
  getReviewById(reviewId: string): Promise<ReviewResponseDTO | null>;
  getRatingSummary(packageId: string): Promise<{ averageRating: number; totalReviews: number }>;
}
