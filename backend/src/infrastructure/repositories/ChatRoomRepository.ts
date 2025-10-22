import { IChatRoomRepository } from '@domain/repositories/IChatRoomRepository';
import { IChatRoom } from '@domain/entities/IChatRoom';
import { ChatRoomModel } from '@infrastructure/models/ChatRoom';
import { CreateChatRoomDTO, UpdateChatRoomDTO } from '@application/dtos/ChatDTO';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';
import { BaseRepository } from './BaseRepository';
import { IChatRoomPopulated } from '@infrastructure/db/types.ts/IChatRoomPopulated';

export class ChatRoomRepository extends BaseRepository<IChatRoom> implements IChatRoomRepository {
  constructor() {
    super(ChatRoomModel);
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
      .populate('participants', '_id username profileImage ')
      .lean<IChatRoomPopulated>();
    return chatRoom;
  }

  async chatUnreadCountForCurrentUser(roomId: string, currentUserId: string): Promise<number> {
  const room = await ChatRoomModel.findById(roomId)
    .select("unreadCounts")
    .lean();

  if (!room) return 0;

  const key = currentUserId.toString();
  const count = room.unreadCounts?.[key] || 0;

  return count;
}

  
  async totalChatUnread(userId: string): Promise<number> {
    const rooms = await ChatRoomModel.find({
      participants: userId,
    })
      .select("unreadCounts")
      .lean();

    let total = 0;

    for (const room of rooms) {
      const key = userId.toString();
      total += room.unreadCounts?.[key] || 0;
    }
console.log(total,'coutnin repos');

    return total;
  }


// async getUserChatRooms(
//   userId: string,
//   filter: EnumChatRoomSort
// ): Promise<IChatRoomPopulated[]> {
//   const query: any = { participants: userId };

//   if (filter === EnumChatRoomSort.UNREAD) {
//     query[`unreadCounts.${userId}`] = { $gt: 0 };
//   } else if (filter === EnumChatRoomSort.READ) {
//     query[`unreadCounts.${userId}`] = { $eq: 0 };
//   }

//   const chatRooms = await ChatRoomModel.find(query)
//     .populate('participants', '_id username profileImage')
//     .sort({ updatedAt: -1 }) // ✅ sort by latest message activity
//     .lean<IChatRoomPopulated[]>();

//   // ✅ Format response with per-room unread count
//   const formattedRooms = chatRooms.map((room) => {
//     const unreadCount = room.unreadCounts?.[userId.toString()] || 0;

//     if (room.isGroup) {
//       return {
//         ...room,
//         participants: room.participants,
//         unreadCount, // ✅ Add here
//       };
//     }

//     // For one-to-one chat, include only the "other" participant
//     const otherUser = (room.participants as any[]).find(
//       (p) => p._id.toString() !== userId
//     );

//     return {
//       ...room,
//       participants: [otherUser],
//       unreadCount,  
//     };
//   });

//   return formattedRooms;
// }


  async getUserChatRooms(userId: string, filter: EnumChatRoomSort): Promise<IChatRoomPopulated[]> {
    const query: any = { participants: userId };

    if (filter === EnumChatRoomSort.UNREAD) {
      query[`unreadCounts.${userId}`] = { $gt: 0 };
    } else if (filter === EnumChatRoomSort.READ) {
      query[`unreadCounts.${userId}`] = { $eq: 0 };
    }

    const chatRooms = await ChatRoomModel.find(query)
      .populate('participants', '_id username profileImage')
      .sort({ updatedAt: -1 })
      .lean<IChatRoomPopulated[]>();

    // Format response
    const formattedRooms = chatRooms.map((room) => {
      if (room.isGroup) {
        return {
          ...room,
          participants: room.participants,
        };
      }

      const otherUser = (room.participants as any[]).find((p) => p._id.toString() !== userId);

      return {
        ...room,
        participants: [otherUser],
      };
    });

    return formattedRooms;
  }

  async findRoomByParticipants(
    participants: string[],
    isGroup: boolean
  ): Promise<IChatRoom | null> {
    if (isGroup) {
      // For group chat, match exact participants count and ids
      return await ChatRoomModel.findOne({
        isGroup: true,
        participants: { $all: participants },
        $expr: { $eq: [{ $size: '$participants' }, participants.length] },
      }).populate('participants', 'username profileImage');
    } else {
      // For 1-on-1 chat, check if same two participants exist
      return await ChatRoomModel.findOne({
        isGroup: false,
        participants: { $all: participants },
        $expr: { $eq: [{ $size: '$participants' }, 2] }, // Ensure only two participants
      }).populate('participants', 'username profileImage');
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
