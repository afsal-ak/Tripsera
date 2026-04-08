import { Request, Response, NextFunction } from 'express';
import { IChatRoomUseCase } from '@application/useCaseInterfaces/chat/IChatRoomUseCases';
import { CreateChatRoomDTO, UpdateChatRoomDTO } from '@application/dtos/ChatDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';
import { getCompanyIdFromRequest } from '@shared/utils/getCompanyIdFromRequest';
import { UserMessages } from '@constants/messages/admin/UserMessages';

export class ChatRoomController {
  constructor(private readonly _chatRoomUseCases: IChatRoomUseCase) { }

  // Create a new chat room
  createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = getCompanyIdFromRequest(req);

      const { participants, name, isGroup } = req.body;
console.log({participants},'participant');

      //  Ensure the current user is added to participants automatically
      const updatedParticipants = Array.from(new Set([...(participants || []), companyId]));

      const data: CreateChatRoomDTO = {
        name,
        participants: updatedParticipants,
        isGroup,
        createdBy: companyId,
      };
      const room = await this._chatRoomUseCases.createChatRoom(data);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Chat room created successfully',
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  //  Get chat room by ID
  getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      const userId = getCompanyIdFromRequest(req);

      const room = await this._chatRoomUseCases.getChatRoomById(roomId, userId);

      if (!room) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Chat room not found' });
        return;
      }
       res.status(HttpStatus.OK).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  totalChatUnread = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCompanyIdFromRequest(req);
 
      const data=await this._chatRoomUseCases.totalChatUnread(userId)
       
      res.status(HttpStatus.OK).json({
        success: true,
        data,
        message:'Chat total unread count send successfully'
      });
    } catch (error) {
      next(error)
    }
  }
  getUserRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCompanyIdFromRequest(req);

      const filter = req.query.filter as EnumChatRoomSort | undefined;

      const rooms = await this._chatRoomUseCases.getUserChatRooms(userId, filter);

      res.status(HttpStatus.OK).json({
        success: true,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  };

  //  Update chat room (rename group)
  updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      const data: UpdateChatRoomDTO = req.body;

      const updatedRoom = await this._chatRoomUseCases.updateChatRoom(roomId, data);

      if (!updatedRoom) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Chat room not found' });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Chat room updated successfully',
        data: updatedRoom,
      });
    } catch (error) {
      next(error);
    }
  };

  //  Delete chat room
  deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;

      const deleted = await this._chatRoomUseCases.deleteChatRoom(roomId);

      if (!deleted) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Chat room not found' });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Chat room deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };


    searchAllUsersForCompany = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const search = (req.query.search as string) || '';
        const users = await this._chatRoomUseCases.searchAllUsersForChat(search);
  
        res.status(HttpStatus.OK).json({
          success: true,
          message: UserMessages.USERS_FETCHED_SUCCESS,
          data: users,
        });
      } catch (error) {
        next(error);
      }
    };
}
