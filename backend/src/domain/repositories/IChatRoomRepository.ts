import { IChatRoom } from '@domain/entities/IChatRoom';
import { CreateChatRoomDTO, UpdateChatRoomDTO } from '@application/dtos/ChatDTO';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';
import { IBaseRepository } from './IBaseRepository';
import { IChatRoomPopulated } from '@infrastructure/db/types.ts/IChatRoomPopulated';

export interface IChatRoomRepository extends IBaseRepository<IChatRoom> {
  createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom>;
  findOneByParticipants(senderId: string, receiverId: string): Promise<IChatRoom | null>;
  findRoomByParticipants(participants: string[], isGroup: boolean): Promise<IChatRoom | null>;

  getChatRoomById(roomId: string): Promise<IChatRoomPopulated | null>;
  getUserChatRooms(userId: string, filters?: EnumChatRoomSort): Promise<IChatRoomPopulated[]>;
  updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null>;
  deleteChatRoom(roomId: string): Promise<boolean>;
}
