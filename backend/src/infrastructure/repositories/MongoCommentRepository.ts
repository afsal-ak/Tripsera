import { ICommentRepository } from "@domain/repositories/ICommentRepository";
import { IComment, IReply } from "@domain/entities/IComment";
import { CommentModel } from "@infrastructure/models/Comment";
import { AppError } from "@shared/utils/AppError";
import { BlogModel } from "@infrastructure/models/Blog";

export class MongoCommentRepository implements ICommentRepository {
  async addComment(blogId: string, userId: string, text: string): Promise<IComment> {
    const comment = await CommentModel.create({ blogId, user: userId, text });
    return comment.toObject();
  }

   async deleteComment(commentId: string, userId: string,blogId:string ): Promise<void> {
   const comment = await CommentModel.findById(commentId);
   if (!comment){
      throw new AppError(400,"Comment not found");
   }
   const blog = await BlogModel.findById(blogId);
   if (!blog){
      throw new Error("Blog not found");
   }
   const isOwner = comment.user.toString() === userId;
   const isAuthor = blog.author.toString() === userId;
 
   if (!isOwner && !isAuthor) {
     throw new AppError(404,"You are not authorized to delete this comment");
   }
 
   await CommentModel.findByIdAndDelete(commentId);
 }
  async getComments(blogId: string, page: number, limit: number): Promise<IComment[]> {
    const skip = (page - 1) * limit;
    return await CommentModel.find({ blogId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name")
      .populate("replies.user", "name")
      .lean();
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    await CommentModel.findByIdAndUpdate(commentId, {
      $addToSet: { likes: userId },
    });
  }

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    await CommentModel.findByIdAndUpdate(commentId, {
      $pull: { likes: userId },
    });
  }

  async replyToComment(commentId: string, userId: string, replyText: string): Promise<IReply> {
    const reply: IReply = {
      user: userId,
      text: replyText,
      createdAt: new Date(),
    };

    const result = await CommentModel.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply } },
      { new: true }
    );

    if (!result || !result.replies?.length){
         throw new AppError(400,"Reply failed");
    }
    return result.replies[result.replies.length - 1];
  }
}
