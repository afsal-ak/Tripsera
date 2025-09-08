import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { IBlogUseCases } from '@application/useCaseInterfaces/admin/IBlogUseCases';
import { IBlog } from '@domain/entities/IBlog';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
export class BlogUseCases implements IBlogUseCases {
  constructor(private _blogRepository: IBlogRepository) {}

  async getAllBlogs(
    page: number,
    limit: number,
    filters?:IFilter
  ):Promise<{blogs:IBlog[],pagination: PaginationInfo;}> {
    return await this._blogRepository.getAllBlog(page, limit, filters);
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this._blogRepository.deleteBlog(blogId);
  }

  async changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void> {
    await this._blogRepository.changeBlogStatus(blogId, isBlocked);
  }

  async getBlogById(blogId: string): Promise<IBlog | null> {
    return await this._blogRepository.getBlogById(blogId);
  }
 
}
