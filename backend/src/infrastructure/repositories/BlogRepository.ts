import { IBlog } from '@domain/entities/IBlog';

import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { BlogModel } from '@infrastructure/models/Blog';
//import { CommentModel } from "@infrastructure/models/Comment";
import { FilterQuery } from 'mongoose';

export class BlogRepository implements IBlogRepository {
  async createBlog(userId: string, blogData: IBlog): Promise<IBlog> {
    const { author, ...restData } = blogData;

    console.log(blogData, 'frommongo');
    const newBlog = await BlogModel.create({ author: userId, ...restData });
    return newBlog.toObject();
  }

  async editBlog(
    blogId: string,
    blogData: Partial<IBlog>,
    deletedImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<IBlog | null> {
    const updateOps: any = {
      ...blogData,
    };

    // Step 1: Pull deleted images
    if (deletedImages.length > 0) {
      await BlogModel.findByIdAndUpdate(blogId, {
        $pull: {
          images: {
            public_id: { $in: deletedImages.map((img) => img.public_id) },
          },
        },
      });
    }
    console.log(deletedImages, 'from momgo');

    // Step 2: Push new images
    if (newImages.length > 0) {
      updateOps.$push = {
        images: {
          $each: newImages,
        },
      };
    }

    // Step 3: Update other fields
    return await BlogModel.findByIdAndUpdate(blogId, updateOps, {
      new: true,
    });
  }

  async getBlogById(blogId: string): Promise<IBlog | null> {
    return await BlogModel.findById(blogId)
      .populate({
        path: 'author',
        select: 'username email profileImage.url',
      })
      .lean();
  }

  async getBlogByUser(
    author: string,
    page: number,
    limit: number
  ): Promise<{ blogs: IBlog[]; totalBlogs: number }> {
    const skip = (page - 1) * limit;

    const [blogs, totalBlogs] = await Promise.all([
      BlogModel.find({ author }).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      BlogModel.countDocuments({ author }),
    ]);

    return { blogs, totalBlogs };
  }

  async getAllBlog(
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
  ): Promise<{ blogs: IBlog[]; totalBlogs: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<IBlog> = {};

    if (filters?.blogSearch) {
      query.title = { $regex: filters.blogSearch, $options: 'i' };
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    if (filters?.authorUsername) {
      query.authorUsername = { $regex: filters.authorUsername, $options: 'i' };
    }

    if (filters?.tags?.length) {
      query.tags = { $in: filters.tags };
    }

    const [blogs, totalBlogs] = await Promise.all([
      BlogModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: 'author',
          select: 'username email profileImage.url',
        })
        .lean(),
      BlogModel.countDocuments(query),
    ]);

    return { blogs, totalBlogs };
  }

  async getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      tags?: string[];
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{ blogs: IBlog[]; totalBlogs: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<IBlog> = {
      status: 'published',
      isBlocked: false,
    };

    if (filters?.search) {
      query.title = { $regex: filters.search, $options: 'i' };
    }

    if (filters?.tags?.length) {
      query.tags = { $in: filters.tags };
    }

    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const [blogs, totalBlogs] = await Promise.all([
      BlogModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      BlogModel.countDocuments(query),
    ]);
    return { blogs, totalBlogs };
  }

  async getBySlug(slug: string): Promise<IBlog | null> {
    return await BlogModel.findOne({ slug })
      .populate({
        path: 'author',
        select: 'username email profileImage.url',
      })
      .lean();
  }

  async likeBlog(blogId: string, userId: string): Promise<IBlog | null> {
    const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, {
      $addToSet: { likes: userId },
    });
    return updatedBlog;
  }

  async unLikeBlog(blogId: string, userId: string): Promise<IBlog | null> {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      { $pull: { likes: userId } },
      { new: true }
    )
      .populate('author', 'username profileImage')
      .lean();

    return updatedBlog;
  }

  async blockBlog(blogId: string, block: boolean): Promise<void> {
    await BlogModel.findByIdAndUpdate(blogId, { isBlocked: block });
  }
  async deleteBlog(blogId: string): Promise<void> {
    await BlogModel.findByIdAndDelete(blogId);
    //  await CommentModel.deleteMany({ blogId });
  }

  async changeBlogStatus(blogId: string, isBlocked: boolean): Promise<void> {
    await BlogModel.findByIdAndUpdate(blogId, { isBlocked });
  }

  async getPublicBlogsByUser(
    author: string,
    page: number,
    limit: number
  ): Promise<{ blogs: IBlog[]; totalBlogs: number }> {
    const skip = (page - 1) * limit;

    const query = {
      author,
      status: 'published',
      isBlocked: false,
    };

    const [blogs, totalBlogs] = await Promise.all([
      BlogModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      BlogModel.countDocuments(query),
    ]);

    return { blogs, totalBlogs };
  }
}
