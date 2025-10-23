import { Request, Response, NextFunction } from 'express';
import { IAdminReviewUseCases } from '@application/useCaseInterfaces/admin/IReviewUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewController {
  constructor(private _reviewUsecases: IAdminReviewUseCases) {}

  getAllReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
        rating: req.query.rating ? parseInt(req.query.rating as string, 10) : undefined,
      };
      const review = await this._reviewUsecases.getAllReviews(page, limit, filters);

      res.status(HttpStatus.OK).json({
        data: review,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;
 
      const review = await this._reviewUsecases.getReviewById(reviewId);
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
      const result = await this._reviewUsecases.deleteReview(reviewId);
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
      const result = await this._reviewUsecases.changeReviewStatus(reviewId, status);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Review status successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
