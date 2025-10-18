import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { MessageModel } from '@infrastructure/models/Message';
import { IMessage } from '@domain/entities/IMessage';
import { SendMessageDTO } from '@application/dtos/MessageDTO';
import { BaseRepository } from './BaseRepository';
import { IMessagePopulated } from '@infrastructure/db/types.ts/IMessagePopulated';

export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async sendMessage(data: SendMessageDTO): Promise<IMessagePopulated> {
    const message = await MessageModel.create(data);

    const populatedMessage = await MessageModel.findById(message._id)
      .populate('senderId', '_id username profileImage')
      .lean<IMessagePopulated>();

    return populatedMessage!;
  }

  async getMessagesByRoom(
    roomId: string,
    limit: number,
    skip: number
  ): Promise<IMessagePopulated[]> {
    return await MessageModel.find({ roomId })
      .populate('senderId', '_id username profileImage')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean<IMessagePopulated[]>();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null> {
    return await MessageModel.findByIdAndUpdate(messageId, { isRead: true }).lean();
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await MessageModel.findByIdAndDelete(messageId);
    return !!result;
  }

  async updateMessage(
    messageId: string,
    updates: Partial<IMessage>
  ): Promise<IMessagePopulated | null> {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { $set: updates },
      { new: true }
    )
      .populate('senderId', '_id username profileImage')
      .lean<IMessagePopulated>();
    return updatedMessage;
  }
}
