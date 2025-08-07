import { IBlog } from '@domain/entities/IBlog';

export interface IBlogUseCases {
  getAllBlogs(
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
  ): Promise<{
    blogs: IBlog[];
    totalBlogs: number;
  }>;

  deleteBlog(blogId: string): Promise<void>;

  changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void>;

  getBlogById(blogId: string): Promise<IBlog | null>;
}
