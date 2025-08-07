import { IReviewUseCases } from '@application/useCaseInterfaces/user/IReviewUseCases';
import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { CreateReviewDTO } from '@application/dtos/ReviewDTO';
import { IReview } from '@domain/entities/IReview';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export class ReviewUseCases implements IReviewUseCases {
  constructor(
    private reviewRepo: IReviewRepository,
    private bookingRepo: IBookingRepository
  ) {}

  async createReview(data: CreateReviewDTO): Promise<IReview> {
    const { userId, packageId } = data;

    const userBooking = await this.bookingRepo.findOneByUserAndPackage(userId, packageId);
    if (!userBooking || userBooking.paymentStatus !== 'paid') {
      throw new AppError(HttpStatus.FORBIDDEN, 'You can only review packages you have booked.');
    }
    const existingReview = await this.reviewRepo.findUserReviewedAlready(userId, packageId);
    if (existingReview) {
      throw new AppError(HttpStatus.CONFLICT, 'You have already reviewed this package.');
    }
    return await this.reviewRepo.create(data);
  }

  async getUserReview(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IReview[];
    pagination: PaginationInfo;
  }> {
    return await this.reviewRepo.findUserReviews(userId, page, limit);
  }

  async getPackageReviews(
    packageId: string,
    page: number,
    limit: number
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
    return await this.reviewRepo.findPackageReviews(packageId, page, limit);
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return await this.reviewRepo.findById(reviewId);
  }
  getRatingSummary(packageId: string) {
    return this.reviewRepo.getPackageRatingSummary(packageId);
  }
  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Review not found');
    }
    if (review.userId.toString() !== userId) {
      console.log(userId, 'userid');
      console.log(review.userId, 'review userid');

      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    return await this.reviewRepo.delete(reviewId);
  }
}
