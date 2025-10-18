import { Request, Response, NextFunction } from 'express';
import { IBlogUseCases } from '@application/useCaseInterfaces/admin/IBlogUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class BlogController {
  constructor(private _blogUseCases: IBlogUseCases) {}

  getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
      };
      const data = await this._blogUseCases.getAllBlogs(page, limit, filters);
      res.status(HttpStatus.OK).json({
        data,
        message: 'blog fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      const blog = await this._blogUseCases.getBlogById(blogId);

      res.status(HttpStatus.OK).json({ blog, message: 'blog fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      await this._blogUseCases.deleteBlog(blogId);
      res.status(HttpStatus.OK).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  changeBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      const { isBlocked } = req.body;
      await this._blogUseCases.changeBlogStatus(blogId, isBlocked);
      res.status(HttpStatus.OK).json({ message: 'Blog status updated' });
    } catch (error) {
      next(error);
    }
  };
}
