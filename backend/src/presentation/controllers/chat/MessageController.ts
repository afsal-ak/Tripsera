import { Request, Response, NextFunction } from "express";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SendMessageDTO, toMessageResponseDTO } from "@application/dtos/MessageDTO";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class MessageController {
  constructor(private readonly _messageUseCases: IMessageUseCases) {}

//   //  Send a message
//   sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const senderId = getUserIdFromRequest(req);
//       console.log(req.body,'req.bod')

//       const data: SendMessageDTO = { ...req.body, senderId };
// console.log(data,'data')
//       const message = await this._messageUseCases.sendMessage(data);

//       res.status(HttpStatus.CREATED).json({
//         success: true,
//         message: "Message sent successfully",
//         data: toMessageResponseDTO(message),
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

  //  Get messages in a chat room
  getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      console.log(roomId,'room id')
      const limit = parseInt(req.query.limit as string) || 40;
      const skip = parseInt(req.query.skip as string) || 0;

      const messages = await this._messageUseCases.getMessagesByRoom(roomId.toString(), limit, skip);
console.log(messages.map(toMessageResponseDTO),'messages')
      res.status(HttpStatus.OK).json({
        success: true,
        data: messages.map(toMessageResponseDTO),
      });
    } catch (error) {
      next(error);
    }
  };

  // //  Mark message as read
  // markMessageRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const messageId = req.params.messageId;
  //     const userId = getUserIdFromRequest(req);

  //     const updatedMessage = await this._messageUseCases.markMessageAsRead(messageId, userId);

  //     if (!updatedMessage) {
  //       res.status(404).json({ success: false, message: "Message not found" });
  //       return;
  //     }

  //     res.status(HttpStatus.OK).json({
  //       success: true,
  //       message: "Message marked as read",
  //       data: toMessageResponseDTO(updatedMessage),
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // //  Delete a message
  // deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const messageId = req.params.messageId;

  //     const deleted = await this._messageUseCases.deleteMessage(messageId);

  //     if (!deleted) {
  //       res.status(404).json({ success: false, message: "Message not found" });
  //       return;
  //     }

  //     res.status(HttpStatus.OK).json({
  //       success: true,
  //       message: "Message deleted successfully",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
