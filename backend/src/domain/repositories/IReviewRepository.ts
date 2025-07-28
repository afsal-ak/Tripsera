import { IReview } from "@domain/entities/IReview";
import { IBaseRepository } from "./IBaseRepository";

export interface IReviewRepository extends IBaseRepository<IReview>{
    findPackageReviews(
    packageId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: IReview[]; total: number; page: number; totalPages: number }>;

  findUserReviews(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: IReview[]; total: number; page: number; totalPages: number }>;
}