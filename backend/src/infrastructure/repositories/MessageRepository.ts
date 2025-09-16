
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { MessageModel } from "@infrastructure/models/Message";
import { IMessage } from "@domain/entities/IMessage";
import { SendMessageDTO } from "@application/dtos/MessageDTO";

export class MessageRepository implements IMessageRepository {
  async sendMessage(data: SendMessageDTO): Promise<IMessage> {
    const message= await MessageModel.create(data);
    
    const populatedMessage = await message.populate("senderId", "_id username profileImage");

  return populatedMessage.toObject();
    
  }

  async getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]> {
    return await MessageModel.find({ roomId })
      .populate("senderId", "username profileImage")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null> {
    console.log(messageId,'id')
     return await MessageModel.findByIdAndUpdate(messageId,
      {isRead:true}
    ).lean();
    // return await MessageModel.findByIdAndUpdate(
    //   messageId,
    //   { $addToSet: { readBy: userId } }, //  Don't blindly set isRead for groups
    //   { new: true }
    // ).lean();
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await MessageModel.findByIdAndDelete(messageId);
    return !!result;
  }
}
