import { Request, Response, NextFunction } from "express";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
import {
  CreateChatRoomDTO,
  UpdateChatRoomDTO,
  toChatRoomResponseDTO,
  toChatRoom1to1DTO,
  IChatRoomFilter
} from "@application/dtos/ChatDTO";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { ChatRoomFilter } from "@application/dtos/ChatDTO";

export class ChatRoomController {
  constructor(private readonly _chatRoomUseCases: IChatRoomUseCase) { }

  // Create a new chat room
  createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { participants, name, isGroup } = req.body;

      //  Ensure the current user is added to participants automatically
      const updatedParticipants = Array.from(new Set([...(participants || []), userId]));

      const data: CreateChatRoomDTO = {
        name,
        participants: updatedParticipants,
        isGroup,
        createdBy: userId,
      };
      const room = await this._chatRoomUseCases.createChatRoom(data);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Chat room created successfully",
        data: toChatRoomResponseDTO(room!),
      });
    } catch (error) {
      next(error);
    }
  };

  //  Get chat room by ID
  getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = req.params.roomId;
      const userId = getUserIdFromRequest(req);

      const room = await this._chatRoomUseCases.getChatRoomById(roomId);

      if (!room) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Chat room not found" });
        return;
      }
      //  console.log(room, 'roooooom')
      res.status(HttpStatus.OK).json({
        success: true,
        data: toChatRoom1to1DTO(room, userId),
      });
    } catch (error) {
      next(error);
    }
  };

  getUserRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const filters: IChatRoomFilter = {
        filter: (req.query.filter as ChatRoomFilter) || "all",
        sort: (req.query.sort as "asc" | "desc") || "desc",
        sortBy: (req.query.sortBy as "createdAt" | "updatedAt") || "updatedAt",
      };
      const rooms = await this._chatRoomUseCases.getUserChatRooms(userId, filters);

      res.status(HttpStatus.OK).json({
        success: true,
        data: rooms.map(toChatRoomResponseDTO),
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
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Chat room not found" });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Chat room updated successfully",
        data: toChatRoomResponseDTO(updatedRoom),
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
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Chat room not found" });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Chat room deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
