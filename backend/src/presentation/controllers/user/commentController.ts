import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { ICommentUseCases } from '@application/useCaseInterfaces/user/ICommentUseCases';
import { CreateCommentDto, ReplyCommentDto } from '@application/dtos/CommentDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class CommentController {
  constructor(private readonly _commentUseCases: ICommentUseCases) {}

  createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      console.log(req.body, 'commet body');

      const data: CreateCommentDto = {
        ...req.body,
        userId: userId,
      };
      const comment = await this._commentUseCases.createComment(data);
      res.status(HttpStatus.CREATED).json({
        data: comment,
        message: 'comment created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  replyComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const data: ReplyCommentDto = {
        ...req.body,
        userId: userId,
      };
      const comment = await this._commentUseCases.createComment(data);

      res.status(HttpStatus.CREATED).json({
        data: comment,
        message: 'comment created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { parentId } = req.params;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await this._commentUseCases.getComments(parentId, page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Comments fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getReplies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const data = await this._commentUseCases.getReplies(commentId, page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Replies fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { commentId } = req.params;
      const userId = getUserIdFromRequest(req);

      const updated = await this._commentUseCases.toggleLike(commentId, userId);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { commentId } = req.params;
      const deleted = await this._commentUseCases.deleteComment(commentId);
      res.status(HttpStatus.OK).json({
        success: deleted,
        message: 'comment deleted succssfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
