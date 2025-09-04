 import { CreateChatRoomDTO, UpdateChatRoomDTO } from "@application/dtos/ChatDTO";
import { IChatRoom } from "@domain/entities/IChatRoom";

export interface IChatRoomUseCase {
    createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom|null>
    updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null>
    deleteChatRoom(roomId: string): Promise<boolean>
    getChatRoomById(roomId: string): Promise<IChatRoom | null>
    getUserChatRooms(userId: string): Promise<IChatRoom[]>
}