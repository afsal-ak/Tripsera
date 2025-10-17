import { IReviewUseCases } from '@application/useCaseInterfaces/user/IReviewUseCases';
import { IReviewRepository } from '@domain/repositories/IReviewRepository';
import { CreateReviewDTO, UpdateReviewDTO } from '@application/dtos/ReviewDTO';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IBookingRepository } from '@domain/repositories/IBookingRepository';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { IFilter } from '@domain/entities/IFilter';
import { ReviewMapper, ReviewResponseDTO, UserReviewListDTO } from '@application/mappers/ReviewMapper';
import { EnumPaymentStatus } from '@constants/enum/paymentEnum';
export class ReviewUseCases implements IReviewUseCases {
  constructor(
    private _reviewRepo: IReviewRepository,
    private _bookingRepo: IBookingRepository,
    private _userRepo: IUserRepository,
    private _packageRepo: IPackageRepository
  ) {}

  async createReview(data: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const { userId, packageId } = data;

    const userBooking = await this._bookingRepo.findOneByUserAndPackage(userId, packageId);
    if (!userBooking || userBooking.paymentStatus !==EnumPaymentStatus.PAID) {
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
      username: user?.username || '',
      packageTitle: packageData?.title || '',
    };

    const newReview = await this._reviewRepo.create(reviewData);
    return ReviewMapper.toResponseDTO(newReview);
  }

  async editReview(
    reviewId: string,
    userId: string,
    data: UpdateReviewDTO
  ): Promise<ReviewResponseDTO> {
    const result = await this._reviewRepo.updateByFilter({ _id: reviewId, userId }, data);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Review not found or not owned by user');
    }
    return ReviewMapper.toResponseDTO(result);
  }

  async getUserReview(
    userId: string,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<UserReviewListDTO>> {
    const result = await this._reviewRepo.findUserReviews(userId, page, limit);

    return {
      data: result.data.map(ReviewMapper.toUserListDTO),
      pagination: result.pagination,
    };
  }

  async getPackageReviews(
    packageId: string,
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<ReviewResponseDTO>> {
    const result = await this._reviewRepo.findPackageReviews(packageId, page, limit, filters);
console.log(result ,'package revies');
console.log(result.review.map(ReviewMapper.toResponseDTO) ,'after mapp package revies');

    return {
      data: result.review.map(ReviewMapper.toResponseDTO),
      pagination: result.pagination,
    };
  }

  async getReviewById(reviewId: string): Promise<ReviewResponseDTO | null> {
    const review = await this._reviewRepo.findById(reviewId);
    return review ? ReviewMapper.toResponseDTO(review) : null;
  }

  async getRatingSummary(packageId: string): Promise<{ averageRating: number; totalReviews: number }> {
    return this._reviewRepo.getPackageRatingSummary(packageId);
  }

  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await this._reviewRepo.findById(reviewId);
    if (!review) throw new AppError(HttpStatus.NOT_FOUND, 'Review not found');

    if (review.userId.toString() !== userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    return await this._reviewRepo.delete(reviewId);
  }
}
