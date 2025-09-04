import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { IMessage } from "@domain/entities/IMessage";
import { SendMessageDTO } from "@application/dtos/MessageDTO";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";

export class MessageUseCases implements IMessageUseCases {
    constructor(
        private readonly _messageRepo: IMessageRepository,
        private readonly _chatRoomRepo: IChatRoomRepository
    ) { }

    // async sendMessage(data: SendMessageDTO): Promise<IMessage> {
    //     let chatRoom = await this._chatRoomRepo.findOneByParticipants(data.senderId, data.receiverId!)
    //     if (!chatRoom) {
    //         chatRoom = await this._chatRoomRepo.createChatRoom({
    //             participants: [data.senderId, data.receiverId!],
    //             isGroup: false,
    //             createdBy:data.senderId
    //         });
    //     }
    //     return await this._messageRepo.sendMessage(data)
    // }

  async sendMessage(data: SendMessageDTO): Promise<IMessage> {
    let chatRoom;

    if (data.roomId) {
         chatRoom = await this._chatRoomRepo.getChatRoomById(data.roomId);
        if (!chatRoom) {
            throw new Error("Chat room not found");
        }
    } else {
         chatRoom = await this._chatRoomRepo.findOneByParticipants(
            data.senderId,
            data.receiverId!
        );

        // If no chat room exists, create one
        if (!chatRoom) {
            chatRoom = await this._chatRoomRepo.createChatRoom({
                participants: [data.senderId, data.receiverId!],
                isGroup: false,
                createdBy: data.senderId,
            });
        }
        // Assign newly created roomId to message
        data.roomId = chatRoom._id?.toString();
    }

    // Save the message
    const message = await this._messageRepo.sendMessage(data);

    // Update last message in the chat room
    await this._chatRoomRepo.updateChatRoom(chatRoom?._id!.toString(), {
        lastMessageContent:data.content,
    });

    return message;
}

    async getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]> {
        return await this._messageRepo.getMessagesByRoom(roomId, limit, skip)
    }

    async markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null> {
        return await this._messageRepo.markMessageAsRead(messageId, userId)
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        console.log(messageId,'id')
        return await this._messageRepo.deleteMessage(messageId)
    }

}