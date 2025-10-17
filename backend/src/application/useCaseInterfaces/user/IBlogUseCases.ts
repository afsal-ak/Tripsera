import { IBlog } from '@domain/entities/IBlog';
import { UserBasicInfoDto } from '@application/dtos/UserBasicInfoDTO';
import { BlogResponseDTO,CreateBlogDTO, UpdateBlogDTO } from '@application/dtos/BlogDTO';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';

export interface IBlogUseCases {
  createBlog(userId: string, blogData: CreateBlogDTO): Promise<BlogResponseDTO>;

  editBlog(
    blogId: string,
    blogData: UpdateBlogDTO,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<BlogResponseDTO | null>;

  getBlogById(blogId: string): Promise<BlogResponseDTO | null>;

  getBlogByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<BlogResponseDTO>>  

 
  getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      tags?: string[];
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResult<BlogResponseDTO>>  


  getBySlug(slug: string): Promise<BlogResponseDTO | null>;

  likeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null>;

  unLikeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null>;

   getBlogLikeList(blogId:string):Promise<UserBasicInfoDto[]|null>
  

  blockBlog(blogId: string, block: boolean): Promise<void>;

  deleteBlog(blogId: string): Promise<void>;

  changeBlogStatus(blogId: string, isActive: boolean): Promise<void>;
  getPublicBlogsByUser(
    userId: string,
    page: number,
    limit: number
   ): Promise<PaginatedResult<BlogResponseDTO>>  

}
