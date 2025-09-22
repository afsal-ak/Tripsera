// import { NextFunction, Request, Response } from "express";
// import { BlockModel } from "@infrastructure/models/Block";
// import { BlogModel } from "@infrastructure/models/Blog";
// import { ChatRoomModel } from "@infrastructure/models/ChatRoom";
// import { AppError } from "@shared/utils/AppError";
// import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
// import { UserModel } from "@infrastructure/models/User";

// // Middleware to check if current user is blocked by target user
// export const checkBlockedMiddleware = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//                 console.log('blcok middlew curent user id')

//         const currentUserId = req.user?._id; // authenticated user
//         console.log(currentUserId,'curent user id')
//         if (!currentUserId) {
//             return next();
//         }
//         let targetUserId: string | undefined;
//         let targetUsername:string|undefined
//         // 1️ Profile route
//         if (req.params.userId) {
//             targetUserId = req.params.userId;
//         }else if(req.params.username){
//             targetUsername=req.params.username
//                             console.log(targetUsername,'pro')

//              const profile = await UserModel.findOne({username:targetUsername});
//             if (!profile) {
//                 throw new AppError(HttpStatus.NOT_FOUND, "User not found");
//             }
//                             console.log(profile._id,'pro id')
//                             console.log(profile._id.toString(),'pro string')

//             targetUserId = profile._id.toString();
//         }

//         // 2️ Blog route
//         else if (req.params.blogId) {
//             const blog = await BlogModel.findById(req.params.blogId);
//             if (!blog) {
//                 throw new AppError(HttpStatus.NOT_FOUND, "Blog not found");
//             }
//             targetUserId = blog.author.toString();
//         }

//         // 3️ Chat route
//         else if (req.params.roomId) {
//             const room = await ChatRoomModel.findById(req.params.roomId);
//             if (!room) {
//                 throw new AppError(HttpStatus.NOT_FOUND, "Chat room not found");
//             }
//             // find the other participant
//             targetUserId = room.participants.find(
//                 (id) => id.toString() !== currentUserId.toString()
//             )?.toString();
//         }

//         if (!targetUserId) {
//             return next(); // no target user detected
//         }
//         console.log(targetUserId,'target user id')
//         // Check if target has blocked current user
//         // const isBlocked = await BlockModel.exists({
//         //     blocker: targetUserId,
//         //     blocked: currentUserId,
//         // });
//         const isBlocked = !!(await BlockModel.exists({
//   $or: [
//     { blocker: targetUserId, blocked: currentUserId },
//     { blocker: currentUserId, blocked: targetUserId },
//   ],
// }));
// console.log(isBlocked,'isblocked')
//         if (isBlocked) {
//             throw new AppError(
//                 HttpStatus.FORBIDDEN,
//                 "You cannot access this user."
//             );
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// };
// checkBlockedMiddleware.ts
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
