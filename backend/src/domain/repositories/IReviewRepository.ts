import { IReview } from '@domain/entities/IReview';
import { IBaseRepository } from './IBaseRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IFilter } from '@domain/entities/IFilter';

export interface IReviewRepository extends IBaseRepository<IReview> {
  findAllReviews(
    page: number,
    limit: number,
    filters?:IFilter
    //sort: 'newest' | 'oldest'
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }>;
  findPackageReviews(
    packageId: string,
    page?: number,
    limit?: number,
    filters?:IFilter
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }>;
  findUserReviewedAlready(userId: string, packageId: string): Promise<IReview | null>;

  findUserReviews(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: IReview[]; pagination: PaginationInfo }>;
  findReviewById(reviewId: string): Promise<IReview | null>;

  getPackageRatingSummary(
    packageId: string
  ): Promise<{ averageRating: number; totalReviews: number }>;
}
