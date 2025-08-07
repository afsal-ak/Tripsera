import { Request, Response, NextFunction } from 'express';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { toReviewResponseDTO } from '@application/dtos/ReviewDTO';
export class ReviewController {
  constructor(private reviewUsecases: IAdminReviewUseCases) {}

  getAllReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const { review, pagination } = await this.reviewUsecases.getAllReviews(page, limit);

      const reviews = review.map(toReviewResponseDTO);

      res.status(HttpStatus.OK).json({
        reviews,
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

      const review = await this.reviewUsecases.getReviewById(reviewId);
      console.log(review, 'review');
      res.status(HttpStatus.OK).json({
        review: review,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
      const result = await this.reviewUsecases.deleteReview(reviewId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  changeReviewStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
      const { status } = req.body;
      console.log({ status }, 'status');
      const result = await this.reviewUsecases.changeReviewStatus(reviewId, status);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Review status successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
