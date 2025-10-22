import {
  SendMessageDTO,
  UpdateMessageDTO,
  MessageResponseDTO,
  MessagePopulatedResponseDTO,
} from '@application/dtos/MessageDTO';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';

export interface IMessageUseCases {
  sendMessage(data: SendMessageDTO): Promise<MessagePopulatedResponseDTO>;
  // getMessagesByRoom(
  //   roomId: string,
  //   page: number,
  //   limit: number
  // ): Promise<MessagePopulatedResponseDTO[]>;
getMessagesByRoom(
    roomId: string,
    page: number,
    limit: number
  ): Promise<IPaginatedResult<MessagePopulatedResponseDTO>>;
   markMessageAsRead(messageId: string, userId: string): Promise<MessageResponseDTO | null>;
  deleteMessage(messageId: string): Promise<boolean>;

  updateMessage(
    messageId: string,
    updates: UpdateMessageDTO
  ): Promise<MessagePopulatedResponseDTO | null>;

  getMessageById(id: string): Promise<MessageResponseDTO | null>;
}
