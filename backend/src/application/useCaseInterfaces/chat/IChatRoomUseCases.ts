import {
  CreateChatRoomDTO,
  UpdateChatRoomDTO,
  ChatRoom1to1ResponseDTO,
  ChatRoomFullResponseDTO,
} from '@application/dtos/ChatDTO';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';

export interface IChatRoomUseCase {
  createChatRoom(data: CreateChatRoomDTO): Promise<ChatRoomFullResponseDTO | null>;
  updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<ChatRoomFullResponseDTO | null>;
  findById(roomId: string): Promise<ChatRoomFullResponseDTO | null>;
  deleteChatRoom(roomId: string): Promise<boolean>;
   totalChatUnread(userId: string): Promise<number>
  getChatRoomById(roomId: string, userId: string): Promise<ChatRoom1to1ResponseDTO | null>;
  getUserChatRooms(userId: string, filters?: EnumChatRoomSort): Promise<ChatRoom1to1ResponseDTO[]>;
}
