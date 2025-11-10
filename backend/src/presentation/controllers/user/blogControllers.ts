import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';
import { CreateBlogDTO, UpdateBlogDTO } from '@application/dtos/BlogDTO';

export class BlogController {
  constructor(private readonly _blogUseCases: IBlogUseCases) { }

  createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      console.log(req.body, 'blog data');

      const blogData: CreateBlogDTO = req.body;

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      console.log(files, 'files');

      //Upload cover image (mandatory)
      if (!files?.coverImage?.[0]) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Cover image is required' });
      }

      const coverImage = await uploadCloudinary(files.coverImage[0].path, 'blogs');
      blogData.coverImage = coverImage;

      // Upload section images if any
      if (blogData.sections && blogData.sections.length > 0) {
        const uploadedSectionImages = await Promise.all(
          (files.sectionImages || []).map((file) => uploadCloudinary(file.path, 'blogs'))
        );

        // attach each uploaded image to its corresponding section if index matches
        blogData.sections = blogData.sections.map((section, index) => ({
          ...section,
          image: uploadedSectionImages[index] || undefined,
        }));
      }

      const blog = await this._blogUseCases.createBlog(userId, blogData);
      res.status(HttpStatus.CREATED).json({ message: 'Blog created successfully', blog });
    } catch (err) {
      next(err);
    }
  };




  editBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      console.log(req.body, 'body');

      const blogData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      console.log(files, 'files');

      const blog = await this._blogUseCases.editBlog(blogId, blogData, files);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog updated successfully',
        blog,
      });
    } catch (error) {
      next(error);
    }
  };
  getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;

      const blog = await this._blogUseCases.getBlogById(blogId);
      res.status(HttpStatus.OK).json(blog);
    } catch (err) {
      next(err);
    }
  };

  getBlogByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const blogs = await this._blogUseCases.getBlogByUser(userId, page, limit);
      res.status(HttpStatus.OK).json(blogs);
    } catch (err) {
      next(err);
    }
  };

  getAllPublishedBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { search, tags, startDate, endDate } = req.query;
      const blogs = await this._blogUseCases.getAllPublishedBlogs(page, limit, {
        search: search?.toString(),
        tags: tags ? tags.toString().split(',') : undefined,
        startDate: startDate?.toString(),
        endDate: endDate?.toString(),
      });

      res.status(HttpStatus.OK).json(blogs);
    } catch (err) {
      next(err);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;

      //   extract userId if user is logged in, otherwise undefined
      let userId: string | undefined;
      try {
        userId = getUserIdFromRequest(req);
      } catch (err) {
        userId = undefined; // No token or invalid token
      }
      const blog = await this._blogUseCases.getBySlug(slug);

      if (!blog) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Blog not found' });
        return;
      }

      // Check if the user has liked the blog (only if user is logged in)
      const isLiked = userId ? blog.likes?.some((id) => id.toString() === userId) : false;
      res.status(HttpStatus.OK).json({ blog: { ...(blog ?? blog), isLiked } });
    } catch (err) {
      next(err);
    }
  };

  likeBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const userId = getUserIdFromRequest(req);
      const updatedBlog = await this._blogUseCases.likeBlog(blogId, userId);

      const isLiked = updatedBlog?.likes?.includes(userId);
      res.status(HttpStatus.OK).json({
        updatedBlog: { ...updatedBlog, isLiked },
        message: 'Liked successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  unLikeBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const userId = getUserIdFromRequest(req);
      const updatedBlog = await this._blogUseCases.unLikeBlog(blogId, userId);

      const isLiked = updatedBlog?.likes?.includes(userId);
      res.status(HttpStatus.OK).json({
        updatedBlog: { ...updatedBlog, isLiked },
        message: 'Unliked successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  getBlogLikeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;

      const data = await this._blogUseCases.getBlogLikeList(blogId);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  blockBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const { block } = req.body;
      const updatedBlog = await this._blogUseCases.blockBlog(blogId, block);
      res.status(HttpStatus.OK).json(updatedBlog);
    } catch (err) {
      next(err);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      await this._blogUseCases.deleteBlog(blogId);
      res.status(HttpStatus.OK).json({ message: 'Blog deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  changeBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const { isActive } = req.body;
      const updatedBlog = await this._blogUseCases.changeBlogStatus(blogId, isActive);
      res.status(HttpStatus.OK).json(updatedBlog);
    } catch (err) {
      next(err);
    }
  };

  getPublicBlogsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const blogs = await this._blogUseCases.getPublicBlogsByUser(userId, page, limit);

      res.status(HttpStatus.OK).json(blogs);
    } catch (error) {
      next(error);
    }
  };
}
