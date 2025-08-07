import { Request, Response, NextFunction } from 'express';
import { IBlogUseCases } from '@application/useCaseInterfaces/admin/IBlogUseCases';

export class BlogController {
  constructor(private _blogUseCases: IBlogUseCases) {}

  getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        blogSearch: req.query.blogSearch as string,
        status: req.query.status as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        authorUsername: req.query.authorUsername as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      };

      const result = await this._blogUseCases.getAllBlogs(page, limit, filters);
      res.status(200).json({ result, message: 'blog fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      const blog = await this._blogUseCases.getBlogById(blogId);

      res.status(200).json({ blog, message: 'blog fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      await this._blogUseCases.deleteBlog(blogId);
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  changeBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = req.params.blogId;
      const { isBlocked } = req.body;
      await this._blogUseCases.changeBlogStatus(blogId, isBlocked);
      res.status(200).json({ message: 'Blog status updated' });
    } catch (error) {
      next(error);
    }
  };
}
