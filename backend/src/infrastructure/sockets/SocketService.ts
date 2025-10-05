
import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SOCKET_EVENTS } from "./events";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";

export class SocketService {
  private onlineUsers: Map<string, string>; // userId -> socketId

  constructor(
    private _io: Server,
    private _messageUseCases: IMessageUseCases,
    private _chatRoomUseCases: IChatRoomUseCase
  ) {
    this.onlineUsers = new Map();
  }

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

   
      socket.on(SOCKET_EVENTS.USER_CONNECTED, ({ userId }) => {
        this.onlineUsers.set(userId, socket.id);

        // notify all clients
        this._io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

        // send the current list of online users to the new user
        socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
          users: Array.from(this.onlineUsers.keys()),
        });

        console.log(`User ${userId} is now online`);
      });
 
      socket.on(SOCKET_EVENTS.USER_DISCONNECTED, ({ userId }) => {
        this.onlineUsers.delete(userId);
        this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
        console.log(`User ${userId} disconnected manually`);
      });
 
      socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
        socket.join(roomId);

         this.onlineUsers.set(userId, socket.id);

        // notify room participants only
        socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

        // send online list to this client
        socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
          users: Array.from(this.onlineUsers.keys()),
        });

        console.log(`User ${userId} joined room ${roomId}`);
      });

   
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
        socket.leave(roomId);

         socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });

        console.log(`User ${userId} left room ${roomId}`);
      });

      
      socket.on(SOCKET_EVENTS.TYPING, ({ roomId, userId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.TYPING, { userId, username });
      });

      socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId, userId }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.STOP_TYPING, { userId });
      });

      
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
        try {
          const savedMessage = await this._messageUseCases.sendMessage(data);

           socket.emit(SOCKET_EVENTS.MESSAGE_SEND, savedMessage);

          //   Broadcast to active room participants (except sender)
          socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);

          // . Fetch participants from ChatRoom
          const chatRoom = await this._chatRoomUseCases.findById(data.roomId);
          const participants: string[] = (chatRoom?.participants || []).map((id: any) =>
            id.toString()
          );

          //   Notify only inactive participants (not in room)
          participants
            .filter((id) => id !== data.senderId)
            .forEach((userId) => {
              const socketId = this.onlineUsers.get(userId);
              if (socketId) {
                // only send if user is NOT already in the room
                const rooms = this._io.sockets.sockets.get(socketId)?.rooms;
                if (!rooms?.has(data.roomId)) {
                  this._io.to(socketId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
                }
              }
            });
        } catch (error: any) {
          socket.emit("error:sendMessage", { message: error.message });
        }
      });

      socket.on(SOCKET_EVENTS.DELETE_MESSAGE, async ({ messageId, roomId }) => {
        try {
          await this._messageUseCases.deleteMessage(messageId);
          this._io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_DELETED, { messageId });
        } catch (error: any) {
          socket.emit("error:deleteMessage", { message: error.message });
        }
      });

      socket.on(SOCKET_EVENTS.MARK_AS_READ, async ({ roomId, messageId, userId }) => {
        await this._messageUseCases.markMessageAsRead(messageId, userId);
        socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, { messageId, userId });
      });

      
      socket.on("disconnect", () => {
        const disconnectedUser = Array.from(this.onlineUsers.entries())
          .find(([_, sId]) => sId === socket.id);

        if (disconnectedUser) {
          const [userId] = disconnectedUser;
          this.onlineUsers.delete(userId);

          this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
          console.log(`User ${userId} disconnected (auto)`);
        }

        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
}
