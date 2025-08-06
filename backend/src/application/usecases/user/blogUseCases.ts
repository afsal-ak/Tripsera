import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { IBlog } from '@domain/entities/IBlog';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';

export class BlogUseCases {
  constructor(private blogRepo: IBlogRepository) {}

  async createBlog(userId: string, blogData: IBlog): Promise<IBlog> {
    return await this.blogRepo.createBlog(userId, blogData);
  }

  async editBlog(
    blogId: string,
    blogData: Partial<IBlog>,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<IBlog | null> {
    const blog = await this.blogRepo.getBlogById(blogId);
    if (!blog) {
      throw new Error('blog not found');
    }
    const oldImages = blog.images || [];
    console.log(oldImages, 'old');
    //  Find which images to delete (not included in existingImages)
    const deletedImages = oldImages.filter(
      (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
    );
    console.log(deletedImages, 'deleted images');

    //  Delete them from Cloudinary
    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }

    return await this.blogRepo.editBlog(blogId, blogData, deletedImages, newImages);
  }

  async getBlogById(blogId: string): Promise<IBlog | null> {
    return await this.blogRepo.getBlogById(blogId);
  }
  async getBlogByUser(userId: string, page: number, limit: number) {
    // console.log(userId,'userId')
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

  async likeBlog(blogId: string, userId: string): Promise<IBlog | null> {
    return await this.blogRepo.likeBlog(blogId, userId);
  }

  async unLikeBlog(blogId: string, userId: string): Promise<IBlog | null> {
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

  async getPublicBlogsByUser(userId: string, page: number, limit: number) {
  return await this.blogRepo.getPublicBlogsByUser(userId, page, limit);
}

}
