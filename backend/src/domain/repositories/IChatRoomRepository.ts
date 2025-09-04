import { IChatRoom } from "@domain/entities/IChatRoom";
import { CreateChatRoomDTO,UpdateChatRoomDTO } from "@application/dtos/ChatDTO";
export interface IChatRoomRepository {
  createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom>;
findOneByParticipants(senderId: string, receiverId: string): Promise<IChatRoom | null>
  findRoomByParticipants(participants: string[], isGroup: boolean) :Promise<IChatRoom|null>

  getChatRoomById(roomId: string): Promise<IChatRoom | null>;
  getUserChatRooms(userId: string): Promise<IChatRoom[]>;
  updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null>;
  deleteChatRoom(roomId: string): Promise<boolean>;
}
