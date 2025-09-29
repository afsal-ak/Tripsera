import { IChatRoom } from "@domain/entities/IChatRoom";
import { CreateChatRoomDTO,UpdateChatRoomDTO,IChatRoomFilter } from "@application/dtos/ChatDTO";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatRoomRepository extends IBaseRepository<IChatRoom> {
  createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom>;
findOneByParticipants(senderId: string, receiverId: string): Promise<IChatRoom | null>
  findRoomByParticipants(participants: string[], isGroup: boolean) :Promise<IChatRoom|null>

  getChatRoomById(roomId: string): Promise<IChatRoom | null>;
  getUserChatRooms(userId: string,filters?:IChatRoomFilter): Promise<IChatRoom[]>;
  updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null>;
  deleteChatRoom(roomId: string): Promise<boolean>;
}
