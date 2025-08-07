import { Request, Response, NextFunction } from 'express';
import { IReviewUseCases } from '@application/useCaseInterfaces/user/IReviewUseCases';
import { toReviewResponseDTO, CreateReviewDTO } from '@application/dtos/ReviewDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';

export class ReviewController {
  constructor(private reviewUseCases: IReviewUseCases) {}

  createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const packageId = req.params.packageId;
      console.log(packageId, 'packageId from review');
      const data: CreateReviewDTO = {
        ...req.body,
        packageId,
        userId,
      };
      console.log(data, 'data from review');
      const review = await this.reviewUseCases.createReview(data);
      res.status(HttpStatus.CREATED).json({
        review: toReviewResponseDTO(review),
        message: 'Review created successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  getUserReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const { data, pagination } = await this.reviewUseCases.getUserReview(userId, page, limit);
      res.status(HttpStatus.OK).json({
        review: data.map(toReviewResponseDTO),
        pagination,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getPackageReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const packageId = req.params.packageId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      const { review, pagination } = await this.reviewUseCases.getPackageReviews(
        packageId,
        page,
        limit
      );
      const reviewsWithUser = review.map(toReviewResponseDTO);

      res.status(HttpStatus.OK).json({
        review: reviewsWithUser,
        pagination,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
      console.log(reviewId, 'reviewId');

      const review = await this.reviewUseCases.getReviewById(reviewId);
      console.log(review, 'review');
      res.status(HttpStatus.OK).json({
        review: review,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  getRatingSummary = async (req: Request, res: Response) => {
    const { packageId } = req.params;
    console.log(packageId, 'id ');
    const summary = await this.reviewUseCases.getRatingSummary(packageId);
    console.log(summary, 'review');
    res.status(200).json(summary);
  };
  deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const reviewId = req.params.reviewId;
      const result = await this.reviewUseCases.deleteReview(reviewId, userId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
