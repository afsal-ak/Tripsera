import { IBlogRepository } from "@domain/repositories/IBlogRepository";


export class BlogUseCases {
  constructor(private blogRepository: IBlogRepository) {}
 async getAllBlogs(
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
    return await this.blogRepository.getAllBlog(page, limit, filters);
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.blogRepository.deleteBlog(blogId);
  }

  async changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void> {
    await this.blogRepository.changeBlogStatus(blogId, isBlocked);
  }

 
  async getBlogById(blogId: string) {
    return await this.blogRepository.getBlogById(blogId);
  }
}
