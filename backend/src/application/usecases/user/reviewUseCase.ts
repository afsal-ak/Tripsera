import { IReviewUseCases } from '@application/useCaseInterfaces/user/IReviewUseCases';
import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { CreateReviewDTO, UpdateReviewDTO } from '@application/dtos/ReviewDTO';
import { IReview } from '@domain/entities/IReview';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewUseCases implements IReviewUseCases {
  constructor(
    private _reviewRepo: IReviewRepository,
    private _bookingRepo: IBookingRepository,
    private _userRepo: IUserRepository,
    private _packageRepo: IPackageRepository
  ) { }

  async createReview(data: CreateReviewDTO): Promise<IReview> {
    const { userId, packageId } = data;

    const userBooking = await this._bookingRepo.findOneByUserAndPackage(userId, packageId);
    if (!userBooking || userBooking.paymentStatus !== 'paid') {
      throw new AppError(HttpStatus.FORBIDDEN, 'You can only review packages you have booked.');
    }
    const existingReview = await this._reviewRepo.findUserReviewedAlready(userId, packageId);
    if (existingReview) {
      throw new AppError(HttpStatus.CONFLICT, 'You have already reviewed this package.');
    }
    const user = await this._userRepo.findById(userId);
    const packageData = await this._packageRepo.findById(packageId);

    const reviewData = {
      ...data,
      username: user?.username,
      packageTitle: packageData?.title,
    };


    return await this._reviewRepo.create(reviewData);
  }

  async editReview(reviewId: string, userId: string, data: UpdateReviewDTO): Promise<IReview> {
    console.log(reviewId, 'id in usecase')
    const result = await this._reviewRepo.updateByFilter({ _id: reviewId, userId }, data)
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Review not found or not owned by user');
    }
    return result
  }

  async getUserReview(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IReview[];
    pagination: PaginationInfo;
  }> {
    return await this._reviewRepo.findUserReviews(userId, page, limit);
  }

  async getPackageReviews(
    packageId: string,
    page: number,
    limit: number,
    filters?:IFilter
  ): Promise<{ review: IReview[]; pagination: PaginationInfo }> {
    return await this._reviewRepo.findPackageReviews(packageId, page, limit,filters);
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return await this._reviewRepo.findById(reviewId);
  }
  getRatingSummary(packageId: string) {
    return this._reviewRepo.getPackageRatingSummary(packageId);
  }
  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await this._reviewRepo.findById(reviewId);
    if (!review) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Review not found');
    }
    if (review.userId.toString() !== userId) {
      console.log(userId, 'userid');
      console.log(review.userId, 'review userid');

      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    return await this._reviewRepo.delete(reviewId);
  }
}
