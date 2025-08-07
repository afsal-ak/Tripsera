 import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { IBlog } from '@domain/entities/IBlog';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';


export class BlogController {
  constructor(private readonly blogUseCases: IBlogUseCases) { }

  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);

      const blogData: IBlog = req.body;
      console.log(blogData, 'blog data');

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
        return;
      }
      files.forEach((file) => {
        console.log(`File: ${file.originalname} | Size: ${(file.size / 1024).toFixed(2)} KB`);
      });
      //    console.log(req.files,'blog images')

      const imageUrls = await Promise.all(
        files.map((file) => uploadCloudinary(file.path, 'blogs'))
      );
      blogData.images = imageUrls;
      const blog = await this.blogUseCases.createBlog(userId, blogData);
      res.status(HttpStatus.CREATED).json({ message: 'Blog created successfully', blog });
    } catch (err) {
      next(err);
    }
  };

  editBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const blogData: Partial<IBlog> = req.body;
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
      //  Pass correct data to use case
      //    await this.blogUseCases.editBlog(id, pkgData, existingImageUrls, newImages);

      const blog = await this.blogUseCases.editBlog(blogId, blogData, existingImageUrls, newImages);
      res.status(HttpStatus.OK).json({ message: 'Blog updated successfully', blog });
    } catch (err) {
      next(err);
    }
  };

  getBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('id');

      const { blogId } = req.params;
      // console.log(blogId, 'id')
      // console.log('id')

      const blog = await this.blogUseCases.getBlogById(blogId);
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
      //console.log(page,limit,'from blog  user')
      const blogs = await this.blogUseCases.getBlogByUser(userId, page, limit);
      res.status(HttpStatus.OK).json(blogs);
    } catch (err) {
      next(err);
    }
  };

  getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { blogSearch, status, startDate, endDate, authorUsername, tags } = req.query;

      const blogs = await this.blogUseCases.getAllBlog(page, limit, {
        blogSearch: blogSearch?.toString(),
        status: status?.toString(),
        startDate: startDate?.toString(),
        endDate: endDate?.toString(),
        authorUsername: authorUsername?.toString(),
        tags: tags ? tags.toString().split(',') : undefined,
      });

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
      //   console.log(req.query, 'search')
      const blogs = await this.blogUseCases.getAllPublishedBlogs(page, limit, {
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

      // Try to extract userId if user is logged in, otherwise undefined
      let userId: string | undefined;
      try {
        userId = getUserIdFromRequest(req);
      } catch (err) {
        userId = undefined; // No token or invalid token
      }
      console.log(userId, 'userid from slug')
      const blog = await this.blogUseCases.getBySlug(slug);

      if (!blog) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Blog not found' });
        return;
      }

      // Check if the user has liked the blog (only if user is logged in)
      const isLiked = userId ? blog.likes?.some((id) => id.toString() === userId) : false;
      res.status(HttpStatus.OK).json({ blog: { ...blog ?? blog, isLiked } });
    } catch (err) {
      next(err);
    }
  };

  likeBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const userId = getUserIdFromRequest(req);
      const updatedBlog = await this.blogUseCases.likeBlog(blogId, userId);

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
      const updatedBlog = await this.blogUseCases.unLikeBlog(blogId, userId);

      const isLiked = updatedBlog?.likes?.includes(userId);
      res.status(HttpStatus.OK).json({
        updatedBlog: { ...updatedBlog, isLiked },
        message: 'Unliked successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  blockBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const { block } = req.body;
      const updatedBlog = await this.blogUseCases.blockBlog(blogId, block);
      res.status(HttpStatus.OK).json(updatedBlog);
    } catch (err) {
      next(err);
    }
  };

  deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      await this.blogUseCases.deleteBlog(blogId);
      res.status(HttpStatus.OK).json({ message: 'Blog deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  changeBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogId } = req.params;
      const { isActive } = req.body;
      const updatedBlog = await this.blogUseCases.changeBlogStatus(blogId, isActive);
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

    const blogs = await this.blogUseCases.getPublicBlogsByUser(userId, page, limit);

    res.status(HttpStatus.OK).json(blogs);
  } catch (error) {
    next(error);
  }
}

}
