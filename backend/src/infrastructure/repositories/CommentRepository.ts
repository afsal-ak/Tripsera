import { CommentModel } from '@infrastructure/models/Comment';
import { IComment } from '@domain/entities/IComment';
import { ICommentRepository } from '@domain/repositories/ICommentRepository';
import { BaseRepository } from './BaseRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { Types } from 'mongoose';
export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {
  constructor() {
    super(CommentModel);
  }

  async replyToComment(commentId: string, reply: { user: string; text: string }): Promise<IComment | null> {
    return CommentModel.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply } }, // if using reply array, or create as separate comment with parentComment
      { new: true }
    );
  }

  async toggleLike(commentId: string, userId: string): Promise<IComment | null> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;

    const hasLiked = comment.likes?.includes(userId);
    const update = hasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    return CommentModel.findByIdAndUpdate(commentId, update, { new: true });
  }

 async  getCommentsByParentId(
  parentId: string,
  page: number,
  limit: number
): Promise<{ data: IComment[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;
  const parentObjectId = new Types.ObjectId(parentId);

  const [comments, total] = await Promise.all([
    CommentModel.aggregate([
      { $match: { parentId: parentObjectId, parentCommentId: null } },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      //  Lookup for user info (populate userId)
      {
        $lookup: {
          from: "users",  
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      //  Lookup for replies count
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies",
        },
      },
      {
        $addFields: {
          replyCount: { $size: "$replies" },
        },
      },
      {
        $project: {
          replies: 0, // don’t include full replies array
          "user.password": 0, 
          "user.email": 0,
        },
      },
    ]),

    CommentModel.countDocuments({
      parentId: parentObjectId,
      parentCommentId: null,
    }),
  ]);

  const pagination: PaginationInfo = {
    totalItems: total,
    currentPage: page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };

  return {
    data: comments,
    pagination,
  };
}
  async getRepliesByCommentId(
    commentId: string,
    page :number,
    limit :number
  ): Promise<{ data: IComment[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      CommentModel.find({ parentCommentId: commentId })
        .populate("userId", "username profileImage")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommentModel.countDocuments({ parentCommentId: commentId }),
    ]);
    console.log(data,'kggggggggggg');
    
    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
    return {
      data,
      pagination
    };
  }
}
