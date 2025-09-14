import { Request, Response, NextFunction } from "express";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SendMessageDTO, toMessageResponseDTO } from "@application/dtos/MessageDTO";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
 import { uploadChatToCloudinary } from "@infrastructure/services/cloudinary/uploadChatToCloudinary ";
import { uploadCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";
export class MessageController {
  constructor(private readonly _messageUseCases: IMessageUseCases) { }

  //  Get messages in a chat room
  getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      console.log(roomId, 'room id')
      const limit = parseInt(req.query.limit as string) || 40;
      const skip = parseInt(req.query.skip as string) || 0;

      const messages = await this._messageUseCases.getMessagesByRoom(roomId.toString(), limit, skip);
      console.log(messages.map(toMessageResponseDTO), 'messages')
      res.status(HttpStatus.OK).json({
        success: true,
        data: messages.map(toMessageResponseDTO),
      });
    } catch (error) {
      next(error);
    }
  };

  uploadMediaToChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body,'body')
      const { type } = req.body

      const filePath = req.file?.path;
            console.log(filePath,'body')

      if (!filePath) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        })
      }
console.log(filePath,'caht result for uplaokd ')

        const result = await uploadChatToCloudinary(filePath!, 'chat',type)  
        console.log(result,'caht result for uplaokd ')

        res.json({
          success: true,
          url: result.url,
          public_id: result.public_id,
          type,
        });
//const { url, public_id } = await uploadCloudinary(imagePath, 'profileImage');

  //     const profileImage = { url, public_id };

  //     const updatedUser = await this._profileUseCases.updateProfileImage(userId, profileImage);

  //     res.status(HttpStatus.CREATED).json({
  //       success: true,
  //       profileImage: updatedUser?.profileImage,
  //       message: 'Profile image uploaded successfully',
  //     });
      
    } catch (error) {
      next(error)
    }
  }

  // updateProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const userId = getUserIdFromRequest(req);
  //     const imagePath = req.file?.path;
  //     if (!imagePath) {
  //       res.status(HttpStatus.BAD_REQUEST).json({
  //         success: false,
  //         message: 'No file uploaded',
  //       });
  //       return;
  //     }

  //     const { url, public_id } = await uploadCloudinary(imagePath, 'profileImage');

  //     const profileImage = { url, public_id };

  //     const updatedUser = await this._profileUseCases.updateProfileImage(userId, profileImage);

  //     res.status(HttpStatus.CREATED).json({
  //       success: true,
  //       profileImage: updatedUser?.profileImage,
  //       message: 'Profile image uploaded successfully',
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

}
