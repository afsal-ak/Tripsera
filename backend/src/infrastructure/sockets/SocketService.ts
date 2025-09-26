
// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
// import { SOCKET_EVENTS } from "./events";
// export class SocketService {
  
//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases
//   ) { }

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(` User connected: ${socket.id}`);


//       socket.on(SOCKET_EVENTS.JOIN_ROOM, ({roomId,userId}) => {
//         socket.join(roomId);
//         socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE,{userId})
//        // console.log(userId,'user id connectee donlien')
//         console.log(` User ${socket.id} joined room ${roomId}`);
//       });


//       socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({roomId,userId}) => {
//         socket.leave(roomId);
//         socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE,{userId})
//            //     console.log(userId,'user id offlien donlien')

//         console.log(` User ${socket.id} left room ${roomId}`);
//       });


//       socket.on(SOCKET_EVENTS.TYPING, ({ roomId, userId, username }) => {
//         socket.to(roomId).emit(SOCKET_EVENTS.TYPING, { userId, username });
//       });

//       socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId, userId }) => {
//         socket.to(roomId).emit(SOCKET_EVENTS.STOP_TYPING, { userId });
//       });


//       socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
//         try {
//           const savedMessage = await this._messageUseCases.sendMessage(data);

//           socket.emit(SOCKET_EVENTS.MESSAGE_SEND, savedMessage);

//           socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
//         } catch (error: any) {
//           socket.emit("error:sendMessage", { message: error.message });
//         }
//       });


//       socket.on(SOCKET_EVENTS.DELETE_MESSAGE, async ({ messageId, roomId }) => {
//         try {
//           await this._messageUseCases.deleteMessage(messageId);

//           this._io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_DELETED, { messageId });
//         } catch (error: any) {
//           socket.emit("error:deleteMessage", { message: error.message });
//         }
//       });

//       socket.on(SOCKET_EVENTS.MARK_AS_READ, async ({ roomId, messageId, userId }) => {
//         await this._messageUseCases.markMessageAsRead(messageId, userId);

//         socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, {
//           messageId,
//           userId,
//         });
//         // this._io.to(roomId).emit("messageSeenUpdate", { roomId, userId, messageId });

//       });


//       socket.on("disconnect", () => {
//         console.log(` User disconnected: ${socket.id}`);
//       });
//     });
//   }
// // }

// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
// import { SOCKET_EVENTS } from "./events";

// export class SocketService {
//   private onlineUsers: Map<string, string>; // userId -> socketId

//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases
//   ) {
//     this.onlineUsers = new Map();
//   }

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(`User connected: ${socket.id}`);

//       // JOIN ROOM
//       socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
//         socket.join(roomId);

//         // track this user
//         this.onlineUsers.set(userId, socket.id);

//         // notify others in the room
//         socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

//         // send current online users back to this client
//         socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
//           users: Array.from(this.onlineUsers.keys()),
//         });

//         console.log(`User ${userId} joined room ${roomId}`);
//       });

//       // LEAVE ROOM
//       socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
//         socket.leave(roomId);
//        // this.onlineUsers.delete(userId);

//         socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });

//         console.log(`User ${userId} left room ${roomId}`);
//       });

//       // TYPING
//       socket.on(SOCKET_EVENTS.TYPING, ({ roomId, userId, username }) => {
//         socket.to(roomId).emit(SOCKET_EVENTS.TYPING, { userId, username });
//       });

//       // STOP_TYPING
//       socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId, userId }) => {
//         socket.to(roomId).emit(SOCKET_EVENTS.STOP_TYPING, { userId });
//       });

//       // SEND_MESSAGE
//       socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
//         try {
//           const savedMessage = await this._messageUseCases.sendMessage(data);

//           socket.emit(SOCKET_EVENTS.MESSAGE_SEND, savedMessage);
//           socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
//         } catch (error: any) {
//           socket.emit("error:sendMessage", { message: error.message });
//         }
//       });

//       // DELETE_MESSAGE
//       socket.on(SOCKET_EVENTS.DELETE_MESSAGE, async ({ messageId, roomId }) => {
//         try {
//           await this._messageUseCases.deleteMessage(messageId);
//           this._io.to(roomId).emit(SOCKET_EVENTS.MESSAGE_DELETED, { messageId });
//         } catch (error: any) {
//           socket.emit("error:deleteMessage", { message: error.message });
//         }
//       });

//       // MARK_AS_READ
//       socket.on(SOCKET_EVENTS.MARK_AS_READ, async ({ roomId, messageId, userId }) => {
//         await this._messageUseCases.markMessageAsRead(messageId, userId);
//         socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, { messageId, userId });
//       });

//       // DISCONNECT
//       socket.on("disconnect", () => {
//         const disconnectedUser = Array.from(this.onlineUsers.entries())
//           .find(([_, sId]) => sId === socket.id);

//         if (disconnectedUser) {
//           const [userId] = disconnectedUser;
//           this.onlineUsers.delete(userId);
//           this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
//         }

//         console.log(`User disconnected: ${socket.id}`);
//       });
//     });
//   }
// }
import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SOCKET_EVENTS } from "./events";

export class SocketService {
  private onlineUsers: Map<string, string>; // userId -> socketId

  constructor(
    private _io: Server,
    private _messageUseCases: IMessageUseCases
  ) {
    this.onlineUsers = new Map();
  }

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      /**
       * 🔹 Global Presence: User Connected
       */
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

      /**
       * 🔹 Global Presence: User Disconnected (manual emit from client)
       */
      socket.on(SOCKET_EVENTS.USER_DISCONNECTED, ({ userId }) => {
        this.onlineUsers.delete(userId);
        this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
        console.log(`User ${userId} disconnected manually`);
      });

      /**
       * 🔹 Join Room
       */
      socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
        socket.join(roomId);

        // still ensure user is tracked
        this.onlineUsers.set(userId, socket.id);

        // notify room participants only
        socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

        // send online list to this client
        socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
          users: Array.from(this.onlineUsers.keys()),
        });

        console.log(`User ${userId} joined room ${roomId}`);
      });

      /**
       * 🔹 Leave Room
       */
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
        socket.leave(roomId);

        // we don’t remove them from global online here — only on disconnect
        socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });

        console.log(`User ${userId} left room ${roomId}`);
      });

      /**
       * 🔹 Typing Events
       */
      socket.on(SOCKET_EVENTS.TYPING, ({ roomId, userId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.TYPING, { userId, username });
      });

      socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId, userId }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.STOP_TYPING, { userId });
      });

      /**
       * 🔹 Messaging
       */
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
        try {
          const savedMessage = await this._messageUseCases.sendMessage(data);

          socket.emit(SOCKET_EVENTS.MESSAGE_SEND, savedMessage);
          socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
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

      /**
       * 🔹 Auto Disconnect (browser close / refresh)
       */
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
