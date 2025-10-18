import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';
import { CreateBlogDTO, UpdateBlogDTO } from '@application/dtos/BlogDTO';

export class BlogController {
  constructor(private readonly _blogUseCases: IBlogUseCases) {}

  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);

      const blogData: CreateBlogDTO = req.body;
      console.log(blogData, 'blog data');

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
        return;
      }
      files.forEach((file) => {
        console.log(`File: ${file.originalname} | Size: ${(file.size / 1024).toFixed(2)} KB`);
      });

      const imageUrls = await Promise.all(
        files.map((file) => uploadCloudinary(file.path, 'blogs'))
      );
      blogData.images = imageUrls;
      const blog = await this._blogUseCases.createBlog(userId, blogData);
      res.status(HttpStatus.CREATED).json({ message: 'Blog created successfully', blog });
    } catch (err) {
      next(err);
    }
  };

  editBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const blogData: UpdateBlogDTO = req.body;
      console.log(blogData, 'from blog edit');
      const files = req.files as Express.Multer.File[];
      console.log(files, 'from blog images');

      const existingImageUrls: { public_id: string }[] = req.body.existingImages || [];

      console.log('EXISTING IMAGES TO KEEP:', existingImageUrls);
      //  Upload new images
      const newImages = files?.length
        ? await Promise.all(files.map((file) => uploadCloudinary(file.path, 'blogs')))
        : [];
      console.log(newImages, 'new Images');
      console.log(existingImageUrls, 'exist Images');

      const blog = await this._blogUseCases.editBlog(
        blogId,
        blogData,
        existingImageUrls,
        newImages
      );
      res.status(HttpStatus.OK).json({ message: 'Blog updated successfully', blog });
    } catch (err) {
      next(err);
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
      console.log(userId, 'userid from slug');
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
      console.log(data, 'blog like');
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
