import { Request, Response, NextFunction } from 'express';
import { IReviewUseCases } from '@application/useCaseInterfaces/user/IReviewUseCases';
import { CreateReviewDTO, UpdateReviewDTO } from '@application/dtos/ReviewDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { IFilter } from '@domain/entities/IFilter';

export class ReviewController {
  constructor(private _reviewUseCases: IReviewUseCases) {}

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
      const review = await this._reviewUseCases.createReview(data);
      res.status(HttpStatus.CREATED).json({
        review,
        message: 'Review created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const reviewId = req.params.reviewId;
      console.log(userId, 'userid');
      console.log(reviewId, 'reviewId');
      const data: UpdateReviewDTO = req.body;

      const review = await this._reviewUseCases.editReview(reviewId, userId, data);

      res.status(HttpStatus.OK).json({
        review,
        message: 'Review fetched successfully',
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
      const data = await this._reviewUseCases.getUserReview(userId, page, limit);
      console.log(data, 'use review');

      res.status(HttpStatus.OK).json({
        data,
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
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
        rating: req.query.rating ? parseInt(req.query.rating as string, 10) : undefined,
      };

      const review = await this._reviewUseCases.getPackageReviews(packageId, page, limit, filters);

      res.status(HttpStatus.OK).json({
        review,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewId = req.params.reviewId;

      const review = await this._reviewUseCases.getReviewById(reviewId);
      res.status(HttpStatus.OK).json({
        review: review,
        message: 'Review fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  getRatingSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { packageId } = req.params;
      const summary = await this._reviewUseCases.getRatingSummary(packageId);
      console.log(summary, 'review');
      res.status(HttpStatus.OK).json({
        summary,
        message: 'Summary fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const reviewId = req.params.reviewId;
      const result = await this._reviewUseCases.deleteReview(reviewId, userId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
