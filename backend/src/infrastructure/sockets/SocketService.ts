
// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
// import events from './events'
// export class SocketService {
//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases
//   ) {}

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(`User connected: ${socket.id}`);

//       // Join room
//       socket.on("joinroom", (roomId: string) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room ${roomId}`);
//       });

//       // Typing indicator  send username too
//       socket.on("typing", ({ roomId, userId, username }) => {
//         socket.to(roomId).emit("typing", { userId, username });
//       });

//       socket.on("stopTyping", ({ roomId, userId }) => {
//         socket.to(roomId).emit("stopTyping", { userId });
//       });

//       // Send message
//       socket.on("sendMessage", async (data) => {
//         try {
//           const savedMessage = await this._messageUseCases.sendMessage(data);

//           // Send back to sender 
//           socket.emit("message:send", savedMessage);

//           // Send to others in the room 
//           socket.to(data.roomId).emit("message:new", savedMessage);
//         } catch (error: any) {
//           socket.emit("error:sendMessage", { message: error.message });
//         }
//       });

//       // Delete message 
//       socket.on("deleteMessage", async ({ messageId, roomId }) => {
//         try {
//           await this._messageUseCases.deleteMessage(messageId);
//           this._io.to(roomId).emit("message:deleted", { messageId }); 
//         } catch (error: any) {
//           socket.emit("error:deleteMessage", { message: error.message });
//         }
//       });

//       // Disconnect
//       socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//       });
//     });
//   }
// }
import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SOCKET_EVENTS } from "./events"; 
export class SocketService {
  constructor(
    private _io: Server,
    private _messageUseCases: IMessageUseCases
  ) {}

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(` User connected: ${socket.id}`);

    
      socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string) => {
        socket.join(roomId);
        console.log(` User ${socket.id} joined room ${roomId}`);
      });

   
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) => {
        socket.leave(roomId);
        console.log(` User ${socket.id} left room ${roomId}`);
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
 
      socket.on(SOCKET_EVENTS.MARK_AS_READ, ({ roomId, messageId, userId }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, {
          messageId,
          userId,
        });
      });

    
      socket.on("disconnect", () => {
        console.log(` User disconnected: ${socket.id}`);
      });
    });
  }
}
