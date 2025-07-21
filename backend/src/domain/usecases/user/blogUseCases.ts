import { IBlogRepository } from "@domain/repositories/IBlogRepository";
import { IBlog } from "@domain/entities/IBlog";
import { IComment } from "@domain/entities/IComment";
import { deleteImageFromCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";

export class BlogUseCases {
    constructor(private blogRepo: IBlogRepository) { }

    async createBlog(userId: string, blogData: IBlog): Promise<IBlog> {
        return await this.blogRepo.createBlog(userId, blogData)
    }

    async editBlog(
        blogId: string,
         blogData: Partial<IBlog>,
        existingImages: { public_id: string }[],
        newImages: { url: string; public_id: string }[]
    ): Promise<IBlog | null> {

        const oldImages = blogData.images || [];
        
          //  Find which images to delete (not included in existingImages)
          const deletedImages = oldImages.filter(
            oldImg => !existingImages.some(img => img.public_id === oldImg.public_id)
          );
        
          //  Delete them from Cloudinary
          for (const img of deletedImages) {
            await deleteImageFromCloudinary(img.public_id);
          }
         
          //  Call repository to update DB
          //await this.packageRepo.editPackage(id, data, deletedImages, newImages);
        
        return await this.blogRepo.editBlog(blogId, blogData,deletedImages,newImages)
    }

    async getBlogById(blogId: string): Promise<IBlog | null> {
        return await this.blogRepo.getBlogById(blogId);
    }
    async getBlogByUser(userId: string, page: number, limit: number) {
        console.log(userId,'userId')
        return await this.blogRepo.getBlogByUser(userId, page, limit);
    }

    async getAllBlog(
        page: number,
        limit: number,
        filters?: {
            blogSearch?: string;
            status?: string;
            startDate?: string;
            endDate?: string;
            authorUsername?: string;
            tags?: string[];
        }
    ) {
        return await this.blogRepo.getAllBlog(page, limit, filters);
    }

    async getAllPublishedBlogs(
        page: number,
        limit: number,
        filters?: {
            search?: string;
            tags?: string[];
            startDate?: string;
            endDate?: string;
        }
    ) {
        return await this.blogRepo.getAllPublishedBlogs(page, limit, filters);
    }

    async getBySlug(slug: string): Promise<IBlog | null> {
        return await this.blogRepo.getBySlug(slug);
    }

    async likeBlog(blogId: string, userId: string): Promise<void> {
        return await this.blogRepo.likeBlog(blogId, userId);
    }

    async unLikeBlog(blogId: string, userId: string): Promise<void> {
        return await this.blogRepo.unLikeBlog(blogId, userId);
    }

    async blockBlog(blogId: string, block: boolean): Promise<void> {
        return await this.blogRepo.blockBlog(blogId, block);
    }

    async deleteBlog(blogId: string): Promise<void> {
        return await this.blogRepo.deleteBlog(blogId);
    }

    async changeBlogStatus(blogId: string, isActive: boolean): Promise<void> {
        return await this.blogRepo.changeBlogStatus(blogId, isActive);
    }
}

