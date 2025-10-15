import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { IMessage } from "@domain/entities/IMessage";
import { SendMessageDTO, UpdateMessageDTO } from "@application/dtos/MessageDTO";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { AppError } from "@shared/utils/AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { ICallRepository } from "@domain/repositories/ICallRepository";
import { ICall } from "@domain/entities/ICall";


export type ChatItemType = "message" | "call";


export interface IChatHistoryItem {
  _id: string;
  roomId: string;
  itemType: ChatItemType; // "message" | "call"

  // For messages
  senderId?: IMessage["senderId"];
  content?: string;
  type?: IMessage["type"];
  mediaUrl?: string;

  // For calls
  callerId?: ICall["callerId"];
  receiverId?: ICall["receiverId"];
  callType?: ICall["callType"];
  status?: ICall["status"];
  startedAt?: ICall["startedAt"];
  endedAt?: ICall["endedAt"];
  duration?: ICall["duration"];

  createdAt: Date;
  updatedAt?: Date;
}
export class MessageUseCases implements IMessageUseCases {
  constructor(
    private readonly _messageRepo: IMessageRepository,
    private readonly _chatRoomRepo: IChatRoomRepository,
    private readonly _callRepo: ICallRepository
  ) { }



  // async sendMessage(data: SendMessageDTO): Promise<IMessage> {

  //   const message = await this._messageRepo.sendMessage(data);

  //   const room = await this._chatRoomRepo.findById(message.roomId.toString())
  //   if (!room) {
  //     throw new AppError(HttpStatus.NOT_FOUND, 'Room not found')
  //   }

  //   const recipientId = room.participants.filter((id) => id.toString() !== data.senderId);

  //   const updatedRoom = await this._chatRoomRepo.updateChatRoom(message.roomId.toString(), {
  //     lastMessageContent: data.content,
  //     unreadCounts: {
  //       ...room.unreadCounts,
  //       [recipientId!.toString()]: (room.unreadCounts?.[recipientId!.toString()] || 0) + 1,
  //     },
  //   });
  //   return message;
  // }

  async sendMessage(data: SendMessageDTO): Promise<IMessage> {
    const message = await this._messageRepo.sendMessage(data);

    const room = await this._chatRoomRepo.findById(message.roomId.toString());
    if (!room) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Room not found');
    }

    const recipientId = room.participants.find(
      (id) => id.toString() !== data.senderId
    );

    //  Set lastMessageContent depending on message type
    let lastMessageContent: string;
    if (data.type === 'image') {
      lastMessageContent = 'Image';
    }
    else if (data.type === 'audio') {
      lastMessageContent = 'Audio';
    } else {
      lastMessageContent = data.content || '';
    }

    const updatedRoom = await this._chatRoomRepo.updateChatRoom(
      message.roomId.toString(),
      {
        lastMessageContent,
        unreadCounts: {
          ...room.unreadCounts,
          [recipientId!.toString()]:
            (room.unreadCounts?.[recipientId!.toString()] || 0) + 1,
        },
      }
    );

    return message;
  }


  async getMessagesByRoom(roomId: string, limit: number, skip: number): Promise<IMessage[]> {
    const msg = await this._messageRepo.getMessagesByRoom(roomId, limit, skip)

    return msg
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<IMessage | null> {
    const message = await this._messageRepo.markMessageAsRead(messageId, userId)
    const roomId = message?.roomId.toString()
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

  // async deleteMessage(messageId: string): Promise<boolean> {
  //   return await this._messageRepo.deleteMessage(messageId)
  // }

  async deleteMessage(messageId: string): Promise<boolean> {

    const message = await this._messageRepo.findById(messageId);
    if (!message) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Message not found');
    }

    // Delete the message
    const deleted = await this._messageRepo.deleteMessage(messageId);
    if (!deleted) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete message');
    }


    const room = await this._chatRoomRepo.findById(message.roomId.toString());
    if (room) {
      await this._chatRoomRepo.updateChatRoom(message.roomId.toString(), {
        lastMessageContent: 'Message deleted',
      });
    }

    return true;
  }


  async updateMessage(messageId: string, updates: UpdateMessageDTO): Promise<IMessage | null> {
    try {
      const message = await this._messageRepo.findById(messageId);
      if (!message) throw new Error("Message not found");

      const existingCallInfo = message.callInfo || {};

      //  Preserve old callInfo and merge new fields
      const newCallInfo = { ...existingCallInfo, ...updates.callInfo };

      //  When call is answered, record startedAt if not already set
      if (updates.callInfo?.status === "answered" && !existingCallInfo.startedAt) {
        newCallInfo.startedAt = new Date();
      }

      //  When call ends, calculate duration using preserved startedAt
      if (updates.callInfo?.status === "ended") {
        const now = new Date();
        const startedAt = existingCallInfo.startedAt || newCallInfo.startedAt;
        newCallInfo.endedAt = now;

        if (startedAt) {
          const diffSeconds = Math.floor(
            (now.getTime() - new Date(startedAt).getTime()) / 1000
          );
          newCallInfo.duration = diffSeconds;
        } else {
          newCallInfo.duration = 0;
        }
      }

      //  Ensure we send merged callInfo back
      const updated = await this._messageRepo.updateMessage(messageId, {
        ...updates,
        callInfo: newCallInfo,
      });

      return updated;
    } catch (error) {
      console.error("Error updating message:", error);
      throw new Error("Failed to update message");
    }
  }

  async getMessageById(id: string): Promise<IMessage | null> {
    const msg = await this._messageRepo.findById(id)
    return msg ? msg : null
  }
  async getCombinedChatAndCallHistory(roomId: string): Promise<IChatHistoryItem[]> {
    const [messages, calls] = await Promise.all([
      this._messageRepo.getMessagesByRoom(roomId, 0, 0),
      this._callRepo.getUserCallByRoom(roomId),
    ]);

    const messageData: IChatHistoryItem[] = messages.map((msg) => ({
      _id: msg._id!.toString(),
      roomId: msg.roomId.toString(),
      itemType: "message",
      senderId: msg.senderId,
      content: msg.content,
      type: msg.type,
      mediaUrl: msg.mediaUrl,
      createdAt: new Date(msg.createdAt ?? Date.now()),
      updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : undefined,
    }));

    const callData: IChatHistoryItem[] = calls.map((call) => ({
      _id: call._id!.toString(),
      roomId: call.roomId.toString(),
      itemType: "call",
      callerId: call.callerId,
      receiverId: call.receiverId,
      callType: call.callType,
      status: call.status,
      startedAt: call.startedAt,
      endedAt: call.endedAt,
      duration: call.duration,
      createdAt: new Date(call.createdAt ?? Date.now()),
      updatedAt: call.updatedAt ? new Date(call.updatedAt) : undefined,
    }));

    const combined = [...messageData, ...callData].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime() // ascending (old → new)
    );

    return combined;
  }


}