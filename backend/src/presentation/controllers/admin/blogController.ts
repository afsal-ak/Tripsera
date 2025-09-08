import { Request, Response, NextFunction } from 'express';
import { IBlogUseCases } from '@application/useCaseInterfaces/admin/IBlogUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { toBlogResponseDTO } from '@application/dtos/BlogDTO';
export class BlogController {
  constructor(private _blogUseCases: IBlogUseCases) { }

  getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || "",
        status: (req.query.status as string) || "",
        sort: (req.query.sort as string) || "",
        startDate: (req.query.startDate as string) || "",
        endDate: (req.query.endDate as string) || "",
      }
      const { blogs, pagination } = await this._blogUseCases.getAllBlogs(page, limit, filters)
      console.log(blogs.map(toBlogResponseDTO, 'res'))
      res.status(HttpStatus.OK).json({
        data: blogs.map(toBlogResponseDTO),
        pagination,
        message: 'blog fetched successfully'
      });

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
