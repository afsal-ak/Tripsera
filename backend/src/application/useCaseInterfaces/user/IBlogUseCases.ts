import { IBlog } from '@domain/entities/IBlog';

export interface IBlogUseCases {
  createBlog(userId: string, blogData: IBlog): Promise<IBlog>;

  editBlog(
    blogId: string,
    blogData: Partial<IBlog>,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<IBlog | null>;

  getBlogById(blogId: string): Promise<IBlog | null>;

  getBlogByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    blogs: IBlog[];
    totalBlogs: number;
  }>;

  getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      tags?: string[];
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    blogs: IBlog[];
    totalBlogs: number;
  }>;

  getBySlug(slug: string): Promise<IBlog | null>;

  likeBlog(blogId: string, userId: string): Promise<IBlog | null>;

  unLikeBlog(blogId: string, userId: string): Promise<IBlog | null>;

  blockBlog(blogId: string, block: boolean): Promise<void>;

  deleteBlog(blogId: string): Promise<void>;

  changeBlogStatus(blogId: string, isActive: boolean): Promise<void>;
  getPublicBlogsByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    blogs: IBlog[];
    totalBlogs: number;
  }>;
}
