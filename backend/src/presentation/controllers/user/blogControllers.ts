import { BlogUseCases } from "@domain/usecases/user/blogUseCases";
import { Request, Response, NextFunction } from "express";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { AppError } from "@shared/utils/AppError";
import { uploadCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";
import { IBlog } from "@domain/entities/IBlog";
export class BlogController {
    constructor(private readonly blogUseCases: BlogUseCases) { }

    createBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getUserIdFromRequest(req);

            const blogData: IBlog = req.body
           // console.log(blogData,'blog data')
        
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
             //    console.log(req.files,'blog images')

            const imageUrls = await Promise.all(
                files.map(file => uploadCloudinary(file.path, 'blogs'))
            );
            blogData.images = imageUrls;
            const blog = await this.blogUseCases.createBlog(userId, blogData);
            res.status(201).json({ message: "Blog created successfully", blog });
        } catch (err) {
            next(err);
        }
    };

    editBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            const blogData: Partial<IBlog> = req.body
            console.log(blogData,'from blog edit')
            const files = req.files as Express.Multer.File[];
            console.log(files,'from blog images')

            //  Parse existingImageUrls from the frontend
            const existingImageUrls: { public_id: string }[] = req.body.existingImageUrls
                ? JSON.parse(req.body.existingImageUrls)
                : [];

            console.log('EXISTING IMAGES TO KEEP:', existingImageUrls);
            //  Upload new images
            const newImages = files?.length
                ? await Promise.all(files.map(file => uploadCloudinary(file.path, 'blogs')))
                : [];
console.log(newImages,'new Images')
console.log(existingImageUrls,'exist Images')
            //  Pass correct data to use case
            //    await this.blogUseCases.editBlog(id, pkgData, existingImageUrls, newImages);

            const blog = await this.blogUseCases.editBlog(blogId, blogData, existingImageUrls, newImages);
            res.status(200).json({ message: "Blog updated successfully", blog });
        } catch (err) {
            next(err);
        }
    };

    getBlogById = async (req: Request, res: Response, next: NextFunction) => {
        try {
                            console.log('id')

            const { blogId } = req.params;
                console.log(blogId,'id')
                console.log('id')

            const blog = await this.blogUseCases.getBlogById(blogId);
            res.status(200).json(blog);
        } catch (err) {
            next(err);
        }
    };

    getBlogByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getUserIdFromRequest(req);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const blogs = await this.blogUseCases.getBlogByUser(userId, page, limit);
            res.status(200).json(blogs);
        } catch (err) {
            next(err);
        }
    };

    getAllBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const {
                blogSearch,
                status,
                startDate,
                endDate,
                authorUsername,
                tags,
            } = req.query;

            const blogs = await this.blogUseCases.getAllBlog(page, limit, {
                blogSearch: blogSearch?.toString(),
                status: status?.toString(),
                startDate: startDate?.toString(),
                endDate: endDate?.toString(),
                authorUsername: authorUsername?.toString(),
                tags: tags ? tags.toString().split(",") : undefined,
            });

            res.status(200).json(blogs);
        } catch (err) {
            next(err);
        }
    };

    getAllPublishedBlogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const {

                search,
                tags,
                startDate,
                endDate,
            } = req.query;

            const blogs = await this.blogUseCases.getAllPublishedBlogs(page, limit, {
                search: search?.toString(),
                tags: tags ? tags.toString().split(",") : undefined,
                startDate: startDate?.toString(),
                endDate: endDate?.toString(),
            });

            res.status(200).json(blogs);
        } catch (err) {
            next(err);
        }
    };

    getBySlug = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { slug } = req.params;
            const blog = await this.blogUseCases.getBySlug(slug);
            res.status(200).json(blog);
        } catch (err) {
            next(err);
        }
    };

    likeBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            const userId = getUserIdFromRequest(req);
            const updatedBlog = await this.blogUseCases.likeBlog(blogId, userId);
            res.status(200).json({updatedBlog,message:"liked successfully"});
        } catch (err) {
            next(err);
        }
    };

    unLikeBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            const userId = getUserIdFromRequest(req);
            const updatedBlog = await this.blogUseCases.unLikeBlog(blogId, userId);
            res.status(200).json({updatedBlog,message:"unliked successfully"});
        } catch (err) {
            next(err);
        }
    };

    blockBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            const { block } = req.body;
            const updatedBlog = await this.blogUseCases.blockBlog(blogId, block);
            res.status(200).json(updatedBlog);
        } catch (err) {
            next(err);
        }
    };

    deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            await this.blogUseCases.deleteBlog(blogId);
            res.status(200).json({ message: "Blog deleted successfully" });
        } catch (err) {
            next(err);
        }
    };

    changeBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { blogId } = req.params;
            const { isActive } = req.body;
            const updatedBlog = await this.blogUseCases.changeBlogStatus(blogId, isActive);
            res.status(200).json(updatedBlog);
        } catch (err) {
            next(err);
        }
    };
}
