import { IChatRoomRepository } from '@domain/repositories/IChatRoomRepository';
import { IChatRoomUseCase } from '@application/useCaseInterfaces/chat/IChatRoomUseCases';
import {
  CreateChatRoomDTO,
  UpdateChatRoomDTO,
  ChatRoom1to1ResponseDTO,
  ChatRoomFullResponseDTO,
} from '@application/dtos/ChatDTO';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';
import { ChatRoomMapper } from '@application/mappers/ChatRoomMapper';
import { AdminUserListResponseDTO, UserChatListResponseDTO } from '@application/dtos/UserDTO';
 import { IUserRepository } from '@domain/repositories/IUserRepository';
import { UserMapper } from '@application/mappers/UserMapper';

export class ChatRoomUseCase implements IChatRoomUseCase {
  constructor(
    private readonly _chatRoomRepo: IChatRoomRepository,
    private readonly _userRepository:IUserRepository
  
  ) {}

  // async createChatRoom(data: CreateChatRoomDTO): Promise<ChatRoomFullResponseDTO | null> {
  //   const existingRoom = await this._chatRoomRepo.findRoomByParticipants(
  //     data.participants,
  //     data.isGroup
  //   );

  //   if (existingRoom) {
  //     return ChatRoomMapper.toFullResponseDTO(existingRoom);
  //   }

  //   // Create a new room if none exists
  //   const newRoom = await this._chatRoomRepo.createChatRoom(data);
  //   return ChatRoomMapper.toFullResponseDTO(newRoom);
  // }
 
async createChatRoom(
  data: CreateChatRoomDTO
): Promise<ChatRoomFullResponseDTO | null> {

  const existingRoom = await this._chatRoomRepo.findRoomByParticipants(
    data.participants,
    data.isGroup
  );

  if (existingRoom) {
    return ChatRoomMapper.toFullResponseDTO(existingRoom);
  }

  const newRoom = await this._chatRoomRepo.createChatRoom(data);

  return ChatRoomMapper.toFullResponseDTO(newRoom);
}
  async updateChatRoom(
    roomId: string,
    data: UpdateChatRoomDTO
  ): Promise<ChatRoomFullResponseDTO | null> {
    const room = await this._chatRoomRepo.updateChatRoom(roomId, data);
    return room ? ChatRoomMapper.toFullResponseDTO(room) : null;
  }

  async findById(roomId: string): Promise<ChatRoomFullResponseDTO | null> {
    const room = await this._chatRoomRepo.findById(roomId);
    return room ? ChatRoomMapper.toFullResponseDTO(room) : null;
  }

  async deleteChatRoom(roomId: string): Promise<boolean> {
    return await this._chatRoomRepo.deleteChatRoom(roomId);
  }

  async getChatRoomById(roomId: string, userId: string): Promise<ChatRoom1to1ResponseDTO | null> {
    const room = await this._chatRoomRepo.getChatRoomById(roomId);
    return room ? ChatRoomMapper.to1to1ResponseDTO(room, userId) : null;
  }
   async  totalChatUnread(userId: string): Promise<number> {
   return await this._chatRoomRepo.totalChatUnread(userId)
   }

  // async getUserChatRooms(
  //   userId: string,
  //   filters?: EnumChatRoomSort
  // ): Promise<ChatRoom1to1ResponseDTO[]> {
  //   console.log(1,'userid',userId);
    
  //   const rooms = await this._chatRoomRepo.getUserChatRooms(userId, filters);
  //    console.log(2,'room',rooms);

  //   return rooms.map((room) => ChatRoomMapper.to1to1ResponseDTO(room, userId));
  // }

async getUserChatRooms(
  userId: string,
  filter: EnumChatRoomSort
): Promise<ChatRoom1to1ResponseDTO[]> {

  const rooms = await this._chatRoomRepo.getUserChatRooms(userId, filter);

  return rooms.map(room =>
    ChatRoomMapper.to1to1ResponseDTO(room, userId)
  );
}


async searchAllUsersForChat(search: string): Promise<UserChatListResponseDTO[]> {
      const user = await this._userRepository.searchAllUsersForChat(search);
      return user.map(UserMapper.toChatUserListDTO);
    }
}
