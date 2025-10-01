import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { IMessage } from "@domain/entities/IMessage";
import { SendMessageDTO } from "@application/dtos/MessageDTO";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class MessageUseCases implements IMessageUseCases {
    constructor(
        private readonly _messageRepo: IMessageRepository,
        private readonly _chatRoomRepo: IChatRoomRepository
    ) { }

 

    async sendMessage(data: SendMessageDTO): Promise<IMessage> {

        const message = await this._messageRepo.sendMessage(data);

        const room = await this._chatRoomRepo.findById(message.roomId.toString())
        if (!room) {
            throw new AppError(HttpStatus.NOT_FOUND, 'Room not found')
        }
       
        const recipientId = room.participants.filter((id) => id.toString() !== data.senderId);
        // console.log(room.participants,'part');
    //    console.log(data.senderId, 'sender')
     //   console.log(recipientId, 'id of recipet')
        const updatedRoom = await this._chatRoomRepo.updateChatRoom(message.roomId.toString(), {
            lastMessageContent: data.content,
            unreadCounts: {
                ...room.unreadCounts,
                [recipientId!.toString()]: (room.unreadCounts?.[recipientId!.toString()] || 0) + 1,
            },
        });
        // console.log(updatedRoom,'update roooom')
        return message;
    }

    async getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]> {
        return await this._messageRepo.getMessagesByRoom(roomId, limit, skip)
    }

    async markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null> {
        //  console.log('jjjjjjjjjjjjjjjj')
        const message= await this._messageRepo.markMessageAsRead(messageId, userId)
        const roomId=message?.roomId.toString()
        const room = await this._chatRoomRepo.findById(roomId!);
        if (!room) throw new AppError(HttpStatus.NOT_FOUND, "Room not found");

       // const currentCount = room.unreadCounts?.[userId] || 0;
        await this._chatRoomRepo.updateChatRoom(roomId!, {
            unreadCounts: {
                ...room.unreadCounts,
                [userId]: 0, 
            },
        });
        return message
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        console.log(messageId, 'id')
        return await this._messageRepo.deleteMessage(messageId)
    }

}