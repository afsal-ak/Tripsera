
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IChatRoom } from "@domain/entities/IChatRoom";
import { ChatRoomModel } from "@infrastructure/models/ChatRoom";
import { CreateChatRoomDTO, UpdateChatRoomDTO } from "@application/dtos/ChatDTO";

export class ChatRoomRepository implements IChatRoomRepository {
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
  async getChatRoomById(roomId: string): Promise<IChatRoom | null> {
    const chatRoom = await ChatRoomModel.findById(roomId)
      .populate("participants", "_id username profileImage ")
      .lean();
    return chatRoom

  }




  async getUserChatRooms(userId: string): Promise<IChatRoom[]> {
    const chatRooms = await ChatRoomModel.find({ participants: userId })
      .populate("participants", "_id username profileImage")
      .sort({ updatedAt: -1 })
      .lean();

    const formattedRooms = chatRooms.map((room) => {
      // If it's a group chat → keep all participants
      if (room.isGroup) {
        return {
          ...room,
          participants: room.participants,
        };
      }

      // For one-to-one chats → return only the other user
      const otherUser = (room.participants as any[]).find(
        (p) => p._id.toString() !== userId
      );

      return {
        ...room,
        participants: [otherUser], // Always keep participants as an array
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
