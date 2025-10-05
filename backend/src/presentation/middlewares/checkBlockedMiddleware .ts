import { NextFunction, Request, Response } from "express";
import { BlockModel } from "@infrastructure/models/Block";
import { BlogModel } from "@infrastructure/models/Blog";
import { ChatRoomModel } from "@infrastructure/models/ChatRoom";
import { UserModel } from "@infrastructure/models/User";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export const checkBlockedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = req.user?._id?.toString();
    if (!currentUserId) return next();

    let targetUserId: string | undefined;

    if (req.params.userId) {
      targetUserId = req.params.userId;
    } else if (req.params.username) {
      const profile = await UserModel.findOne({ username: req.params.username });
      if (profile) targetUserId = profile._id.toString();
    } else if (req.params.blogId) {
      const blog = await BlogModel.findById(req.params.blogId);
      if (blog) targetUserId = blog.author.toString();
    }else if (req.params.slug) {
      const blog = await BlogModel.findOne({slug:req.params.slug});
      if (blog) {
        targetUserId = blog.author.toString();
    }  
  }
    else if (req.params.roomId) {
      const room = await ChatRoomModel.findById(req.params.roomId);
      if (room) {
        targetUserId = room.participants.find(
          (id) => id.toString() !== currentUserId
        )?.toString();
      }
    }

    if (!targetUserId) return next();

    const isBlocked = await BlockModel.exists({
      $or:[
        {blocker: currentUserId,
      blocked:targetUserId },
     { blocker:targetUserId ,
      blocked:currentUserId }
      ]
      
    });

     if (isBlocked) {
      console.log(isBlocked,'lkj');
            req.isBlockedByTarget = true;

      throw new AppError(HttpStatus.FORBIDDEN,'This profile is not available')
    } else {
      req.isBlockedByTarget = false;
    }

    next();
  } catch (error) {
    next(error);
  }
};
