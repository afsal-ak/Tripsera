import { IMessage } from '@domain/entities/IMessage';
import { SendMessageDTO } from '@application/dtos/MessageDTO';
import { IBaseRepository } from './IBaseRepository';
import { IMessagePopulated } from '@infrastructure/db/types.ts/IMessagePopulated';
import { PaginationInfo
  
 } from '@application/dtos/PaginationDto';
export interface IMessageRepository extends IBaseRepository<IMessage> {
  sendMessage(data: SendMessageDTO): Promise<IMessagePopulated>;
  getMessagesByRoom(roomId: string, page?: number, limit?: number): Promise<{data:IMessagePopulated[],pagination: PaginationInfo}>;
  markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null>;
  deleteMessage(messageId: string): Promise<boolean>;
  updateMessage(messageId: string, updates: Partial<IMessage>): Promise<IMessagePopulated | null>;
}
