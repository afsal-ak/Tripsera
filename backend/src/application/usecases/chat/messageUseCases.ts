import { IMessageRepository } from '@domain/repositories/IMessageRepository';
import { IMessageUseCases } from '@application/useCaseInterfaces/chat/IMessageUseCases';
import {
  MessagePopulatedResponseDTO,
  SendMessageDTO,
  UpdateMessageDTO,
} from '@application/dtos/MessageDTO';
import { IChatRoomRepository } from '@domain/repositories/IChatRoomRepository';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { MessageResponseDTO } from '@application/dtos/MessageDTO';
import { MessageMapper } from '@application/mappers/MessageMapper';
export type ChatItemType = 'message' | 'call';

export class MessageUseCases implements IMessageUseCases {
  constructor(
    private readonly _messageRepo: IMessageRepository,
    private readonly _chatRoomRepo: IChatRoomRepository
  ) {}

  async sendMessage(data: SendMessageDTO): Promise<MessagePopulatedResponseDTO> {
    const message = await this._messageRepo.sendMessage(data);

    const room = await this._chatRoomRepo.findById(message.roomId.toString());
    if (!room) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Room not found');
    }

    const recipientId = room.participants.find((id) => id.toString() !== data.senderId);

    //  Set lastMessageContent depending on message type
    let lastMessageContent: string;
    if (data.type === 'image') {
      lastMessageContent = 'Image';
    } else if (data.type === 'audio') {
      lastMessageContent = 'Audio';
    } else {
      lastMessageContent = data.content || '';
    }

    const updatedRoom = await this._chatRoomRepo.updateChatRoom(message.roomId.toString(), {
      lastMessageContent,
      unreadCounts: {
        ...room.unreadCounts,
        [recipientId!.toString()]: (room.unreadCounts?.[recipientId!.toString()] || 0) + 1,
      },
    });

    return MessageMapper.toPopulatedResponseDTO(message);
  }

  async getMessagesByRoom(
    roomId: string,
    limit: number,
    skip: number
  ): Promise<MessagePopulatedResponseDTO[]> {
    const message = await this._messageRepo.getMessagesByRoom(roomId, limit, skip);

    return message.map(MessageMapper.toPopulatedResponseDTO);
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<MessageResponseDTO | null> {
    const message = await this._messageRepo.markMessageAsRead(messageId, userId);
    const roomId = message?.roomId.toString();
    const room = await this._chatRoomRepo.findById(roomId!);
    if (!room) throw new AppError(HttpStatus.NOT_FOUND, 'Room not found');

    await this._chatRoomRepo.updateChatRoom(roomId!, {
      unreadCounts: {
        ...room.unreadCounts,
        [userId]: 0,
      },
    });
    return message ? MessageMapper.toResponseDTO(message) : null;
  }

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

  async updateMessage(
    messageId: string,
    updates: UpdateMessageDTO
  ): Promise<MessagePopulatedResponseDTO | null> {
    try {
      const message = await this._messageRepo.findById(messageId);
      if (!message) throw new Error('Message not found');

      const existingCallInfo = message.callInfo || {};

      //  Preserve old callInfo and merge new fields
      const newCallInfo = { ...existingCallInfo, ...updates.callInfo };

      //  When call is answered, record startedAt if not already set
      if (updates.callInfo?.status === 'answered' && !existingCallInfo.startedAt) {
        newCallInfo.startedAt = new Date();
      }

      //  When call ends, calculate duration using preserved startedAt
      if (updates.callInfo?.status === 'ended') {
        const now = new Date();
        const startedAt = existingCallInfo.startedAt || newCallInfo.startedAt;
        newCallInfo.endedAt = now;

        if (startedAt) {
          const diffSeconds = Math.floor((now.getTime() - new Date(startedAt).getTime()) / 1000);
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

      return updated ? MessageMapper.toPopulatedResponseDTO(updated) : null;
    } catch (error) {
      throw new Error('Failed to update message');
    }
  }

  async getMessageById(id: string): Promise<MessageResponseDTO | null> {
    const msg = await this._messageRepo.findById(id);
    return msg ? MessageMapper.toResponseDTO(msg) : null;
  }
}
