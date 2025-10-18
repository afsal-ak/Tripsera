import { IBlog } from '@domain/entities/IBlog';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { UserBasicInfoDto } from '@application/dtos/UserBasicInfoDTO';
import { IBaseRepository } from './IBaseRepository';

export interface IBlogRepository extends IBaseRepository<IBlog>{
  createBlog(userId: string, blogData: IBlog): Promise<IBlog>;
  editBlog(
    id: string,
    blogData: Partial<IBlog>,
    deletedImages?: { public_id: string }[],
    newImages?: { url: string; public_id: string }[]
  ): Promise<IBlog | null>;

  getAllBlog(
    page: number,
    limit: number,
    filters?:IFilter
  ): Promise<{ blogs: IBlog[]; pagination: PaginationInfo }>;

  getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      tags?: string[];
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ blogs: IBlog[]; pagination: PaginationInfo }> 

  getBlogByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ blogs: IBlog[]; pagination: PaginationInfo }> 
  getBlogById(blogId: string): Promise<IBlog | null>;
  getBySlug(slug: string): Promise<IBlog | null>;
  deleteBlog(blogId: string): Promise<void>;
  changeBlogStatus(blogId: string, isActive: boolean): Promise<void>;
  likeBlog(blogId: string, userId: string): Promise<IBlog | null>;
  unLikeBlog(blogId: string, userId: string): Promise<IBlog | null>;
  blockBlog(blogId: string, block: boolean): Promise<void>;

 getLikedList(blogId: string): Promise<UserBasicInfoDto[] | null>
  getPublicBlogsByUser(
    author: string,
    page: number,
    limit: number
  ): Promise<{ blogs: IBlog[]; pagination: PaginationInfo }>  
}
