import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { IBlogUseCases } from '@application/useCaseInterfaces/admin/IBlogUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
import { BlogMapper } from '@application/mappers/BlogMapper';
import { BlogResponseDTO } from '@application/dtos/BlogDTO';

export class BlogUseCases implements IBlogUseCases {
  constructor(private _blogRepository: IBlogRepository) {}

  async getAllBlogs(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<PaginatedResult<BlogResponseDTO>> {
    const result = await this._blogRepository.getAllBlog(page, limit, filters);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this._blogRepository.deleteBlog(blogId);
  }

  async changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void> {
    await this._blogRepository.changeBlogStatus(blogId, isBlocked);
  }

  async getBlogById(blogId: string): Promise<BlogResponseDTO | null> {
    const result = await this._blogRepository.getBlogById(blogId);
    return BlogMapper.toResponseDTO(result!);
  }
}
