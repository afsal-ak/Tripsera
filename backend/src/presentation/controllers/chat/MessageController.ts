import { Request, Response, NextFunction } from 'express';
import { IMessageUseCases } from '@application/useCaseInterfaces/chat/IMessageUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { uploadChatToCloudinary } from '@infrastructure/services/cloudinary/uploadChatToCloudinary ';

export class MessageController {
  constructor(private readonly _messageUseCases: IMessageUseCases) {}

  //  Get messages in a chat room
  getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
 
      const messages = await this._messageUseCases.getMessagesByRoom(
        roomId.toString(),
        page,
        limit
      );
       res.status(HttpStatus.OK).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadMediaToChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       const { type } = req.body;

      const filePath = req.file?.path;
 
      if (!filePath) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const result = await uploadChatToCloudinary(filePath!, 'chat', type);
 
      res.json({
        success: true,
        url: result.url,
        public_id: result.public_id,
        type,
      });
    } catch (error) {
      next(error);
    }
  };
}
