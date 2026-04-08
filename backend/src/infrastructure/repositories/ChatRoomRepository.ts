import { IChatRoomRepository } from '@domain/repositories/IChatRoomRepository';
import { IChatRoom } from '@domain/entities/IChatRoom';
import { ChatRoomModel } from '@infrastructure/models/ChatRoom';
import { CreateChatRoomDTO, UpdateChatRoomDTO } from '@application/dtos/ChatDTO';
import { EnumChatRoomSort } from '@constants/enum/chatRoomEnum';
import { BaseRepository } from './BaseRepository';
import { IChatRoomPopulated } from '@infrastructure/db/types.ts/IChatRoomPopulated';
import { CompanyModel } from '@infrastructure/models/Company';
import { UserModel } from '@infrastructure/models/User';

export class ChatRoomRepository extends BaseRepository<IChatRoom> implements IChatRoomRepository {
  constructor() {
    super(ChatRoomModel);
  }
 private async detectParticipantModels(ids: string[]): Promise<('Users' | 'Company')[]> {

    const users = await UserModel.find({ _id: { $in: ids } }).select('_id');
    const companies = await CompanyModel.find({ _id: { $in: ids } }).select('_id');

    const userSet = new Set(users.map(u => u._id.toString()));
    const companySet = new Set(companies.map(c => c._id.toString()));

    return ids.map(id => {
      if (userSet.has(id)) return 'Users';
      if (companySet.has(id)) return 'Company';
      throw new Error(`Invalid participant id: ${id}`);
    });
  }

async createChatRoom(data: CreateChatRoomDTO) {

    const participantModels = await this.detectParticipantModels(data.participants);

    return await ChatRoomModel.create({
      name: data.name,
      participants: data.participants,
      participantModels, // 🔥 auto set
      isGroup: data.isGroup,
      createdBy: data.createdBy,
    });
  }

  async findRoomByParticipants(participants: string[], isGroup: boolean) {
    return await ChatRoomModel.findOne({
      participants: { $all: participants, $size: participants.length },
      isGroup,
    });
  }

  // async getUserChatRooms(userId: string, filter: any) {
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

  const rooms = await ChatRoomModel.find(query)
    .populate('participants', '_id username name profileImage logo')
    .sort({ updatedAt: -1 })
    .lean();

  // 🔥 ensure type safety (important)
  return rooms as IChatRoomPopulated[];
}
// async getUserChatRooms(
//   userId: string,
//   filter: EnumChatRoomSort
// ): Promise<IChatRoomPopulated[]> {
//     const query: any = { participants: userId };

//     if (filter === EnumChatRoomSort.UNREAD) {
//       query[`unreadCounts.${userId}`] = { $gt: 0 };
//     } else if (filter ===  EnumChatRoomSort.READ) {
//       query[`unreadCounts.${userId}`] = { $eq: 0 };
//     }

//     return await ChatRoomModel.find(query)
//       .populate('participants', '_id username name profileImage logo')
//       .sort({ updatedAt: -1 })
//       .lean();
//   }

  // async createChatRoom(data: CreateChatRoomDTO): Promise<IChatRoom> {
  //   return await ChatRoomModel.create(data);
  // }

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


//   async getUserChatRooms(userId: string, filter: EnumChatRoomSort): Promise<IChatRoomPopulated[]> {
//     const query: any = { participants: userId };

//     if (filter === EnumChatRoomSort.UNREAD) {
//       query[`unreadCounts.${userId}`] = { $gt: 0 };
//     } else if (filter === EnumChatRoomSort.READ) {
//       query[`unreadCounts.${userId}`] = { $eq: 0 };
//     }

//     const chatRooms = await ChatRoomModel.find(query)
//       .populate('participants', '_id username profileImage')
//       .sort({ updatedAt: -1 })
//       .lean<IChatRoomPopulated[]>();
// console.log(chatRooms,'chatRooms user in repo');
// console.log(chatRooms.participants,'chatRooms user in repo');

//     // Format response
//     const formattedRooms = chatRooms.map((room) => {
//       if (room.isGroup) {
//         return {
//           ...room,
//           participants: room.participants,
//         };
//       }
 
//       const otherUser = (room.participants as any[]).find((p) => p._id.toString() !== userId);
// console.dir(otherUser,'other user in repo');

//       return {
//         ...room,
//       //  participants: [otherUser],
//       };
//     });

//     return formattedRooms;
//   }


// async getUserChatRooms(
//   userId: string,
//   filter: EnumChatRoomSort
// ): Promise<IChatRoomPopulated[]> {

//   const query: any = { participants: userId };

//   console.log('\n============================');
//   console.log('🔐 Logged in UserId:', userId);

//   if (filter === EnumChatRoomSort.UNREAD) {
//     query[`unreadCounts.${userId}`] = { $gt: 0 };
//   } else if (filter === EnumChatRoomSort.READ) {
//     query[`unreadCounts.${userId}`] = { $eq: 0 };
//   }
// const chatRooms = await ChatRoomModel.find(query).lean();

// const formattedRooms = await Promise.all(
//   chatRooms.map(async (room) => {

//     const participants = await Promise.all(
//       room.participants.map(async (id: any) => {

//         // 🔍 check in UserModel
//         let user = await UserModel.findById(id)
//           .select('_id username profileImage')
//           .lean();

//         if (user) return user;

//         // 🔍 check in CompanyModel
//         let company = await CompanyModel.findById(id)
//           .select('_id name profileImage')
//           .lean();

//         return company;
//       })
//     );

//     return {
//       ...room,
//       participants: participants.filter(Boolean),
//     };
//   })
// )}
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
//     .populate({
//       path: 'participants',
//       select: '_id username profileImage companyId',
//       populate: {
//         path: 'companyId',
//         select: 'username name', // adjust based on your Company schema
//       },
//     })
//     .sort({ updatedAt: -1 })
//     .lean<IChatRoomPopulated[]>();
// console.log(chatRooms,'caht room');

//   const formattedRooms = chatRooms.map((room) => {
//     if (room.isGroup) return room;

//     let otherUser = (room.participants as any[]).find(
//       (p) => p && p._id && p._id.toString() !== userId
//     );

//     console.log(otherUser, '👤 other user');

//     // 🔥 FALLBACK: use company if user not found
//     if (!otherUser) {
//       const fallback = (room.participants as any[])[0];

//       if (fallback?.companyId) {
//         otherUser = {
//           _id: fallback.companyId._id,
//           username: fallback.companyId.name || 'Company',
//           profileImage: fallback.companyId.logo || '',
//         };
//       }
//     }

//     return {
//       ...room,
//       participants: otherUser ? [otherUser] : [],
//     };
//   });

//   return formattedRooms;
// }


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
//     .populate({
//       path: 'participants',
//       select: '_id username profileImage companyId',
//       populate: {
//         path: 'companyId',
//         select: 'name logo',
//       },
//     })
//     .sort({ updatedAt: -1 })
//     .lean<IChatRoomPopulated[]>();

//   // 🔥 FULL STRUCTURE
//   console.log('\n🔥 FULL CHAT ROOMS');
//   console.dir(chatRooms, { depth: null });

//   // 🔥 CLEAN JSON
//   console.log('\n🔥 JSON FORMAT');
//   console.log(JSON.stringify(chatRooms, null, 2));

//   // 🔥 PARTICIPANT LEVEL DEBUG
//   chatRooms.forEach((room, i) => {
//     console.log(`\n📦 Room ${i}`);

//     (room.participants as any[]).forEach((p, j) => {
//       console.log(`  👤 Participant ${j}:`, {
//         _id: p?._id?.toString(),
//         username: p?.username,
//         companyId: p?.companyId?._id?.toString(),
//         companyName: p?.companyId?.name,
//       });
//     });
//   });

//   const formattedRooms = chatRooms.map((room) => {
//     if (room.isGroup) return room;

//     let otherUser = (room.participants as any[]).find(
//       (p) => p && p._id && p._id.toString() !== userId
//     );

//     console.log('👉 Found otherUser:', otherUser);

//     // 🔥 FALLBACK
//     if (!otherUser) {
//       const fallback = (room.participants as any[])[0];

//       console.log('⚠️ fallback user:', fallback);

//       if (fallback?.companyId) {
//         console.log('🏢 Using company fallback:', fallback.companyId);

//         otherUser = {
//           _id: fallback.companyId._id,
//           username: fallback.companyId.name || 'Company',
//           profileImage: fallback.companyId.logo || '',
//         };
//       }
//     }

//     console.log('✅ Final otherUser:', otherUser);

//     return {
//       ...room,
//       participants: otherUser ? [otherUser] : [],
//     };
//   });

//   return formattedRooms;
// }










































  // async findRoomByParticipants(
  //   participants: string[],
  //   isGroup: boolean
  // ): Promise<IChatRoom | null> {
  //   if (isGroup) {
  //     // For group chat, match exact participants count and ids
  //     return await ChatRoomModel.findOne({
  //       isGroup: true,
  //       participants: { $all: participants },
  //       $expr: { $eq: [{ $size: '$participants' }, participants.length] },
  //     }).populate('participants', 'username profileImage');
  //   } else {
  //     // For 1-on-1 chat, check if same two participants exist
  //     return await ChatRoomModel.findOne({
  //       isGroup: false,
  //       participants: { $all: participants },
  //       $expr: { $eq: [{ $size: '$participants' }, 2] }, // Ensure only two participants
  //     }).populate('participants', 'username profileImage');
  //   }
  // }

  async updateChatRoom(roomId: string, data: UpdateChatRoomDTO): Promise<IChatRoom | null> {
    return await ChatRoomModel.findByIdAndUpdate(roomId, data, { new: true }).lean();
  }

  async deleteChatRoom(roomId: string): Promise<boolean> {
    const result = await ChatRoomModel.findByIdAndDelete(roomId);
    return !!result;
  }
}
