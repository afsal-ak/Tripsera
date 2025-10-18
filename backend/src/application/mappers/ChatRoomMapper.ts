import { IChatRoomPopulated } from "@infrastructure/db/types.ts/IChatRoomPopulated";
import { ChatRoom1to1ResponseDTO,ChatRoomFullResponseDTO } from "@application/dtos/ChatDTO";
import { IChatRoom } from "@domain/entities/IChatRoom";

export class ChatRoomMapper {
  static to1to1ResponseDTO(chatRoom: IChatRoomPopulated, currentUserId: string): ChatRoom1to1ResponseDTO {
    const otherUser = chatRoom.participants.find(
      (p) => p._id!.toString() !== currentUserId
    );

    return {
      _id: chatRoom._id.toString(),
      otherUser: {
        _id: otherUser?._id!.toString() || "",
        username: otherUser?.username || "",
        profileImage: otherUser?.profileImage?.url,
      },
    //   lastMessage: chatRoom.lastMessage
    //     ? {
    //         content: chatRoom.lastMessage.content,
    //         sender: chatRoom.lastMessage.sender.toString(),
    //         createdAt: chatRoom.lastMessage.createdAt,
    //       }
    //     : null,
    lastMessageContent:chatRoom.lastMessageContent||'',
      unreadCount: chatRoom.unreadCounts?.[currentUserId] || 0,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
    };
  }

//   static toGroupResponseDTO(chatRoom: IChatRoomPopulated): ChatRoomGroupResponseDTO {
//     return {
//       _id: chatRoom._id.toString(),
//       groupName: chatRoom.groupName || "",
//       participants: chatRoom.participants.map((p) => ({
//         _id: p._id.toString(),
//         username: p.username,
//         profileImage: p.profileImage,
//       })),
//       lastMessage: chatRoom.lastMessage
//         ? {
//             content: chatRoom.lastMessage.content,
//             sender: chatRoom.lastMessage.sender.toString(),
//             createdAt: chatRoom.lastMessage.createdAt,
//           }
//         : null,
//       createdAt: chatRoom.createdAt,
//       updatedAt: chatRoom.updatedAt,
//     };
//   }

// static toFullResponseDTO(
//     room: IChatRoom,
//     currentUserId?: string
//   ): ChatRoomFullResponseDTO {
//     return {
//       _id: room._id!.toString(),
//       name: room.name || null,
//       isGroup: room.isGroup,
//       createdBy: room.createdBy.toString(),
//     //   participants: room.participants.map((p: any) => ({
//     //     _id: p._id.toString(),
//     //     username: p.username,
//     //     profileImage: p.profileImage,
         
//     //   })),
//       lastMessageContent: room.lastMessageContent||'',
        
//       unreadCounts: room.unreadCounts || {},
//       createdAt: room.createdAt!,
//       updatedAt: room.updatedAt!,
//     };
//   }
 static toFullResponseDTO(room: IChatRoom): ChatRoomFullResponseDTO {
    return {
      _id: room._id!.toString(),
      name: room.name || null,
      isGroup: room.isGroup,
      createdBy: room.createdBy.toString(),
      participants: room.participants.map((p: any) => p.toString()),
      lastMessageContent: room.lastMessageContent || null,
      unreadCounts: room.unreadCounts || {},
      createdAt: room.createdAt!,
      updatedAt: room.updatedAt!,
    };
  }
}
