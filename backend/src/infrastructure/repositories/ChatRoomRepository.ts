
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IChatRoom } from "@domain/entities/IChatRoom";
import { ChatRoomModel } from "@infrastructure/models/ChatRoom";
import { CreateChatRoomDTO, UpdateChatRoomDTO } from "@application/dtos/ChatDTO";
import { EnumChatRoomSort } from "@constants/enum/chatRoomEnum";
import { BaseRepository } from "./BaseRepository";
import { IChatRoomPopulated } from "@infrastructure/db/types.ts/IChatRoomPopulated";

export class ChatRoomRepository extends BaseRepository<IChatRoom> implements IChatRoomRepository {
  constructor() {
    super(ChatRoomModel)
  }
  async createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom> {
    return await ChatRoomModel.create(data);
  }

  async findOneByParticipants(senderId: string, receiverId: string): Promise<IChatRoom | null> {
    let chatRoom = await ChatRoomModel.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
      isGroup: false,
    });

    // If no chat room exists, create a new one automatically
    if (!chatRoom) {
      chatRoom = await ChatRoomModel.create({
        participants: [senderId, receiverId],
        isGroup: false,
        createdBy: senderId,
      });
    }

    return chatRoom;
  }
  async getChatRoomById(roomId: string): Promise<IChatRoomPopulated | null> {
    const chatRoom = await ChatRoomModel.findById(roomId)
      .populate("participants", "_id username profileImage ")
      .lean<IChatRoomPopulated>();
    return chatRoom

  }


  async getUserChatRooms(
    userId: string,
    filter: EnumChatRoomSort 
  ): Promise<IChatRoomPopulated[]> {
     const query: any = { participants: userId };

    if (filter === EnumChatRoomSort.UNREAD) {
      query[`unreadCounts.${userId}`] = { $gt: 0 };
    } else if (filter === EnumChatRoomSort.READ) {
      query[`unreadCounts.${userId}`] = { $eq: 0 };
    }

  
    const chatRooms = await ChatRoomModel.find(query)
      .populate("participants", "_id username profileImage")
      .sort({ createdAt:-1 })
      .lean<IChatRoomPopulated[]>();

    // Format response
    const formattedRooms = chatRooms.map((room) => {
      if (room.isGroup) {
        return {
          ...room,
          participants: room.participants,
        };
      }

      const otherUser = (room.participants as any[]).find(
        (p) => p._id.toString() !== userId
      );

      return {
        ...room,
        participants: [otherUser],
      };
    });

    return formattedRooms;
  }


  async findRoomByParticipants(participants: string[], isGroup: boolean): Promise<IChatRoom | null> {
    if (isGroup) {
      // For group chat, match exact participants count and ids
      return await ChatRoomModel.findOne({
        isGroup: true,
        participants: { $all: participants },
        $expr: { $eq: [{ $size: "$participants" }, participants.length] },
      }).populate("participants", "username profileImage");
    } else {
      // For 1-on-1 chat, check if same two participants exist
      return await ChatRoomModel.findOne({
        isGroup: false,
        participants: { $all: participants },
        $expr: { $eq: [{ $size: "$participants" }, 2] }, // Ensure only two participants
      }).populate("participants", "username profileImage");
    }
  }

  async updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null> {
    return await ChatRoomModel.findByIdAndUpdate(roomId, data, { new: true }).lean();
  }

  async deleteChatRoom(roomId: string): Promise<boolean> {
    const result = await ChatRoomModel.findByIdAndDelete(roomId);
    return !!result;
  }
}
