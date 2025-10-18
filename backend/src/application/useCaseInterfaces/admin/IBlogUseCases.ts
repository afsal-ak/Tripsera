import { IFilter } from '@domain/entities/IFilter';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
import { BlogResponseDTO } from '@application/dtos/BlogDTO';

export interface IBlogUseCases {
  getAllBlogs(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<PaginatedResult<BlogResponseDTO>>;

  deleteBlog(blogId: string): Promise<void>;

  changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void>;

  getBlogById(blogId: string): Promise<BlogResponseDTO | null>;
}
