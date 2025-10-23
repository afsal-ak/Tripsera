import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { MessageModel } from '@infrastructure/models/Message';
import { IMessage } from '@domain/entities/IMessage';
import { SendMessageDTO } from '@application/dtos/MessageDTO';
import { BaseRepository } from './BaseRepository';
import { IMessagePopulated } from '@infrastructure/db/types.ts/IMessagePopulated';
import { PaginationInfo } from '@application/dtos/PaginationDto';

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
  page: number,
  limit: number
): Promise<{ data: IMessagePopulated[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    MessageModel.find({ roomId })
      .populate('senderId', '_id username profileImage')
      .sort({ createdAt: -1 }) //  newest first
      .skip(skip)
      .limit(limit)
      .lean<IMessagePopulated[]>(),
    MessageModel.countDocuments({ roomId })  
  ]);

  const pagination: PaginationInfo = {
    totalItems: total,
    currentPage: page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };

  // Reverse so messages show oldest → newest in frontend
  return {
    data: data.reverse(),
    pagination,
  };
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
