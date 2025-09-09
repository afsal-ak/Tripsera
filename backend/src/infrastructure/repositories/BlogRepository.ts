import { IBlog } from '@domain/entities/IBlog';
import { IFilter } from '@domain/entities/IFilter';

import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { BlogModel } from '@infrastructure/models/Blog';
import { SortOrder } from 'mongoose';
//import { CommentModel } from "@infrastructure/models/Comment";
import { FilterQuery } from 'mongoose';
import { PaginationInfo } from '@application/dtos/PaginationDto';
export class BlogRepository implements IBlogRepository {
  async createBlog(userId: string, blogData: IBlog): Promise<IBlog> {
    const { author, ...restData } = blogData;

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
    filters?: IFilter
  ): Promise<{ blogs: IBlog[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;
    const matchStage: any = {};

    //  Filter by status
    if (filters?.status) {
      matchStage.isBlocked = filters.status === "active" ? false : true;
    }

    //  Filter by date range
    if (filters?.startDate && filters?.endDate) {
      matchStage.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    // Set sorting
    const sortOption: Record<string, SortOrder> = {
      createdAt: filters?.sort === "asc" ? 1 : -1,
    };

    // Base pipeline
    const aggregatePipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ];
    //  Add search stage if needed
    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i");
      aggregatePipeline.push({
        $match: {
          $or: [{ title: searchRegex }, { "author.username": searchRegex }],
        },
      });
    }

    // Get total blogs count
    const totalResult = await BlogModel.aggregate([
      ...aggregatePipeline,
      { $count: "total" },
    ]);
    const total = totalResult[0]?.total || 0;

    aggregatePipeline.push(
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          isBlocked: 1,
          "author._id": 1,
          "author.username": 1,
          "author.email": 1,
        },
      }
    );

    //  Fetch paginated blogs
    const blogs = await BlogModel.aggregate(aggregatePipeline);
    console.log(blogs, 'bolg')
    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { blogs, pagination };
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
      BlogModel.find(query)
        .populate({
          path: 'author',
          select: 'username email profileImage.url',
        })
        .skip(skip).limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
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
