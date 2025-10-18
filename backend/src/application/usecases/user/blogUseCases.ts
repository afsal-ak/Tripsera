import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { IBlog } from '@domain/entities/IBlog';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';
import { UserBasicInfoDto } from '@application/dtos/UserBasicInfoDTO';
import { BlogResponseDTO } from '@application/dtos/BlogDTO';
import { BlogMapper } from '@application/mappers/BlogMapper';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
export class BlogUseCases implements IBlogUseCases {
  constructor(private readonly blogRepo: IBlogRepository) {}

  async createBlog(userId: string, blogData: IBlog): Promise<BlogResponseDTO> {
    const result = await this.blogRepo.createBlog(userId, blogData);
    return BlogMapper.toResponseDTO(result);
  }

  async editBlog(
    blogId: string,
    blogData: Partial<IBlog>,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<BlogResponseDTO | null> {
    const blog = await this.blogRepo.getBlogById(blogId);
    if (!blog) throw new Error('Blog not found');

    const deletedImages = (blog.images || []).filter(
      (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
    );

    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }

    const result = await this.blogRepo.editBlog(blogId, blogData, deletedImages, newImages);
    return BlogMapper.toResponseDTO(result!);
  }

  async getBlogById(blogId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.getBlogById(blogId);
    return BlogMapper.toResponseDTO(result!);
  }

  async getBlogByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<BlogResponseDTO>> {
    const result = await this.blogRepo.getBlogByUser(userId, page, limit);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }

  async getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: { search?: string; tags?: string[]; startDate?: string; endDate?: string }
  ) {
    const result = await this.blogRepo.getAllPublishedBlogs(page, limit, filters);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }

  async getBySlug(slug: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.getBySlug(slug);
    return BlogMapper.toResponseDTO(result!);
  }

  async likeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.likeBlog(blogId, userId);
    return BlogMapper.toResponseDTO(result!);
  }

  async getBlogLikeList(blogId: string): Promise<UserBasicInfoDto[] | null> {
    return await this.blogRepo.getLikedList(blogId);
  }

  async unLikeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.unLikeBlog(blogId, userId);
    return BlogMapper.toResponseDTO(result!);
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

  async getPublicBlogsByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<BlogResponseDTO>> {
    const result = await this.blogRepo.getPublicBlogsByUser(userId, page, limit);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }
}
