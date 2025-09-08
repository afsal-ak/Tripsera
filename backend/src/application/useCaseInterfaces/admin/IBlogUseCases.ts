import { IBlog } from '@domain/entities/IBlog';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
export interface IBlogUseCases {
  getAllBlogs(
    page: number,
    limit: number,
    filters?:IFilter
  ): Promise<{
    blogs: IBlog[];
    pagination: PaginationInfo;
  }>;

  deleteBlog(blogId: string): Promise<void>;

  changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void>;

  getBlogById(blogId: string): Promise<IBlog | null>;
}
