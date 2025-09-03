import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { CreateChatRoomDTO, UpdateChatRoomDTO } from "@application/dtos/ChatDTO";
import { IChatRoom } from "@domain/entities/IChatRoom";

export class eChatRoomUseCase {
    constructor(private readonly _chatRoomRepo:IChatRoomRepository){}

    async createChatRoom(data:CreateChatRoomDTO){
        return await this._chatRoomRepo.createChatRoom(data)
    }

    async updateChatRoom(roomId:string,data:UpdateChatRoomDTO):Promise<IChatRoom|null>{
        return await this._chatRoomRepo.updateChatRoom(roomId,data)
    }

    async deleteChatRoom(roomId:string):Promise<boolean>{
        return await this._chatRoomRepo.deleteChatRoom(roomId)
    }
    
    async getChatRoomById(roomId:string):Promise<IChatRoom|null>{
        return await this._chatRoomRepo.getChatRoomById(roomId)
    }

      async getUserChatRooms(userId: string): Promise<IChatRoom[]> {
        return await this._chatRoomRepo.getUserChatRooms(userId)
      }


}