import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
import { CreateChatRoomDTO, UpdateChatRoomDTO,IChatRoomFilter } from "@application/dtos/ChatDTO";
import { IChatRoom } from "@domain/entities/IChatRoom";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class ChatRoomUseCase implements IChatRoomUseCase {
    constructor(private readonly _chatRoomRepo: IChatRoomRepository) { }

    async createChatRoom(data: CreateChatRoomDTO):Promise<IChatRoom|null> {
        const existingRoom = await this._chatRoomRepo.findRoomByParticipants(data.participants, data.isGroup);

        if (existingRoom) {
           return existingRoom
        }

        // Create a new room if none exists
        const newRoom = await this._chatRoomRepo.createChatRoom(data);
        return newRoom
    }

    async updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null> {
        return await this._chatRoomRepo.updateChatRoom(roomId, data)
    }

    async findById(roomId: string): Promise<IChatRoom | null> {
        return await this._chatRoomRepo.findById(roomId)
    }

    async deleteChatRoom(roomId: string): Promise<boolean> {
        return await this._chatRoomRepo.deleteChatRoom(roomId)
    }

    async getChatRoomById(roomId: string): Promise<IChatRoom | null> {
        return await this._chatRoomRepo.getChatRoomById(roomId)
    }

    async getUserChatRooms(userId: string,filters?:IChatRoomFilter): Promise<IChatRoom[]> {
        return await this._chatRoomRepo.getUserChatRooms(userId,filters)
    }


}