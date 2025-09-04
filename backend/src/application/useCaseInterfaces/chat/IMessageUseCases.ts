 import { IMessage } from "@domain/entities/IMessage";
import { SendMessageDTO } from "@application/dtos/MessageDTO";

export interface IMessageUseCases {
    sendMessage(data: SendMessageDTO): Promise<IMessage>
    getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]>
    markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null>
    deleteMessage(messageId: string): Promise<boolean>
}