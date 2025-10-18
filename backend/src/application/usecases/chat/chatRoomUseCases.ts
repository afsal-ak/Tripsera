import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatRoomUseCases";
import { CreateChatRoomDTO, UpdateChatRoomDTO, ChatRoom1to1ResponseDTO, ChatRoomFullResponseDTO } from "@application/dtos/ChatDTO";
import { EnumChatRoomSort } from "@constants/enum/chatRoomEnum";
import { IChatRoom } from "@domain/entities/IChatRoom";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { ChatRoomMapper } from "@application/mappers/ChatRoomMapper";
 
export class ChatRoomUseCase implements IChatRoomUseCase {
    constructor(private readonly _chatRoomRepo: IChatRoomRepository) { }

    async createChatRoom(data: CreateChatRoomDTO): Promise<ChatRoomFullResponseDTO | null> {
        const existingRoom = await this._chatRoomRepo.findRoomByParticipants(data.participants, data.isGroup);

        if (existingRoom) {
            return ChatRoomMapper.toFullResponseDTO(existingRoom)
        }

        // Create a new room if none exists
        const newRoom = await this._chatRoomRepo.createChatRoom(data);
        return ChatRoomMapper.toFullResponseDTO(newRoom)
    }

    async updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<ChatRoomFullResponseDTO | null> {
        const room = await this._chatRoomRepo.updateChatRoom(roomId, data)
        return room ? ChatRoomMapper.toFullResponseDTO(room) : null
    }

    async findById(roomId: string): Promise<ChatRoomFullResponseDTO | null> {
        const room = await this._chatRoomRepo.findById(roomId)
        return room ? ChatRoomMapper.toFullResponseDTO(room) : null

    }

    async deleteChatRoom(roomId: string): Promise<boolean> {
        return await this._chatRoomRepo.deleteChatRoom(roomId)
    }

    async getChatRoomById(roomId: string, userId: string): Promise<ChatRoom1to1ResponseDTO | null> {
        const room = await this._chatRoomRepo.getChatRoomById(roomId)
        return room ? ChatRoomMapper.to1to1ResponseDTO(room, userId) : null

    }
    async getUserChatRooms(
        userId: string,
        filters?: EnumChatRoomSort
    ): Promise<ChatRoom1to1ResponseDTO[]> {
        const rooms = await this._chatRoomRepo.getUserChatRooms(userId, filters);

        return rooms.map((room) => ChatRoomMapper.to1to1ResponseDTO(room, userId));
    }

}

// import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
// import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatRoomUseCases";
// import {
//     CreateChatRoomDTO,
//     UpdateChatRoomDTO,
//     IChatRoomFilter,
//     ChatRoom1to1ResponseDTO
// } from "@application/dtos/ChatDTO";
// import { ChatRoomMapper } from "@application/mappers/ChatRoomMapper";
// import { IChatRoom } from "@domain/entities/IChatRoom";
// import { AppError } from "@shared/utils/AppError";
// import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

// export class ChatRoomUseCase implements IChatRoomUseCase {
//     constructor(private readonly _chatRoomRepo: IChatRoomRepository) { }

//     async createChatRoom(data: CreateChatRoomDTO):Promise<ChatRoom1to1ResponseDTO|null> {
//         const existingRoom = await this._chatRoomRepo.findRoomByParticipants(data.participants, data.isGroup);

//         if (existingRoom) {
//            return existingRoom
//         }

//         // Create a new room if none exists
//         const newRoom = await this._chatRoomRepo.createChatRoom(data);
//         return newRoom
//     }

//     async updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<ChatRoom1to1ResponseDTO | null> {
//         const room= await this._chatRoomRepo.updateChatRoom(roomId, data)
//         return room?ChatRoomMapper.to1to1ResponseDTO(room):null
//     }

//     async findById(roomId: string): Promise<ChatRoom1to1ResponseDTO | null> {
//         const room= await this._chatRoomRepo.findById(roomId)
//                 return room?ChatRoomMapper.to1to1ResponseDTO(room):null

//     }

//     async deleteChatRoom(roomId: string): Promise<boolean> {
//         return await this._chatRoomRepo.deleteChatRoom(roomId)
//     }

//     async getChatRoomById(roomId: string): Promise<ChatRoom1to1ResponseDTO | null> {
//         return await this._chatRoomRepo.getChatRoomById(roomId)
//     }

//     async getUserChatRooms(userId: string,filters?:IChatRoomFilter): Promise<ChatRoom1to1ResponseDTO[]> {
//         return await this._chatRoomRepo.getUserChatRooms(userId,filters)
//     }


// }