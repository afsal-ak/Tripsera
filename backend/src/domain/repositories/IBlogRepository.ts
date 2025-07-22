import { IBlog } from "@domain/entities/IBlog";
export interface IBlogRepository {
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
        filters?: {
            blogSearch?: string;
            status?: string;
            startDate?: string;
            endDate?: string;
            authorUsername?: string;
            tags?: string[];
        }
    ): Promise<{ blogs: IBlog[]; totalBlogs: number }>;

    getAllPublishedBlogs(page: number, limit: number, filters?: {
        search?: string;
        tags?: string[];
        startDate?: string;
        endDate?: string;
    }): Promise<{ blogs: IBlog[]; totalBlogs: number }>;

    getBlogByUser(userId: string, page: number, limit: number): Promise<{ blogs: IBlog[], totalBlogs: number }>;
    getBlogById(blogId: string): Promise<IBlog | null>;
    getBySlug(slug: string): Promise<IBlog | null>;
    deleteBlog(blogId: string): Promise<void>;
    changeBlogStatus(blogId: string, isActive: boolean): Promise<void>;
    likeBlog(blogId: string, userId: string): Promise<void>;
    unLikeBlog(blogId: string, userId: string): Promise<void>;
    blockBlog(blogId: string, block: boolean): Promise<void>;
}
