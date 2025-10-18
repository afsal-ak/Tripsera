import { IMessage } from "@domain/entities/IMessage";
import { IMessagePopulated } from "@infrastructure/db/types.ts/IMessagePopulated";
import { MessagePopulatedResponseDTO, MessageResponseDTO } from "@application/dtos/MessageDTO";
import { EnumMessageType } from "@constants/enum/messageEnum";

export abstract class MessageMapper {

    static toResponseDTO(message: IMessage): MessageResponseDTO {
    return {
      _id: message._id!.toString(),
      roomId: message.roomId.toString(),
      senderId: message.senderId.toString(),
      content: message.content,
      type: message.type || EnumMessageType.TEXT,
      mediaUrl: message.mediaUrl,
      isRead: message.isRead ?? false,
      readBy: message.readBy?.map((id) => id.toString()) ?? [],
      callInfo: message.callInfo,
      createdAt: message.createdAt!,
      updatedAt: message.updatedAt!,
    };
  }
  static toPopulatedResponseDTO(message: IMessagePopulated): MessagePopulatedResponseDTO {
    return {
      _id: message._id!.toString(),
      roomId: message.roomId.toString(),
      senderId: {
        _id: message.senderId._id.toString(),
        username: message.senderId.username,
        profileImage: message.senderId.profileImage?.url || "",
      },
      content: message.content,
      type: message.type || EnumMessageType.TEXT,
      mediaUrl: message.mediaUrl || "",
      isRead: message.isRead ?? false,
      readBy: message.readBy?.map((id) => id.toString()) || [],
      callInfo: message.callInfo || undefined,
      createdAt: message.createdAt!,
      updatedAt: message.updatedAt!,
    };
  }
}
