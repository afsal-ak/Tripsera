// // import { Socket, Server } from "socket.io";
// // import { IMessageUseCases } from "@application/useCaseInterfaces/user/IMessageUseCases";


// // export class SocketService {

// //     constructor(
// //         private _io: Server,
// //         private _messageUseCases: IMessageUseCases
// //     ) { }

// //     public initialize() {
// //         this._io.on("connection", (socket: Socket) => {
// //             console.log('user is connected');

// //             //join room

// //             socket.on("joinroom", (roomId: string) => {
// //                 socket.join(roomId);
// //                 console.log(` User ${socket.id} joined room ${roomId}`);
// //             })

// //             socket.on("typing", ({ roomId, userId }) => {
// //                 socket.to(roomId).emit("typing", { userId })
// //             })

// //             //typing Indicator
// //             socket.on("typing", ({ roomId, userId }) => {
// //                 socket.to(roomId).emit("typing", { userId });
// //             })

// //             socket.on("stopTyping", ({ roomId, userId }) => {
// //                 socket.to(roomId).emit("stopTyping", { userId });
// //             });

// //             //sendMessage
// //             socket.on("sendMessage", async (data) => {
// //                 try {
// //                     const savedMessage = await this._messageUseCases.sendMessage(data)

// //                     socket.emit("messageSend", savedMessage)

// //                     socket.to(data.roomId).emit("newMessage", savedMessage)

// //                 } catch (error: any) {
// //                     socket.emit("error", {
// //                         event: "sendMessage",
// //                         message: error.message,
// //                     });
// //                 }
// //             })

// //             //  Delete Message
// //             socket.on("deleteMessage", async ({ messageId, roomId }) => {
// //                 try {
// //                     await this._messageUseCases.deleteMessage(messageId);

// //                     // Broadcast message deletion to everyone in the room
// //                     this._io.to(roomId).emit("messageDeleted", { messageId });
// //                 } catch (error: any) {
// //                     socket.emit("error", {
// //                         event: "deleteMessage",
// //                         message: error.message,
// //                     });
// //                 }
// //             });

// //             //  Handle Disconnect
// //             socket.on("disconnect", () => {
// //                 console.log(` User disconnected: ${socket.id}`);
// //             });
// //         })



// //     }



// // }


// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/user/IMessageUseCases";

// export class SocketService {
//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases
//   ) {}

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(` User connected: ${socket.id}`);

//       // Join room
//       socket.on("joinroom", (roomId: string) => {
//         socket.join(roomId);
//         console.log(` User ${socket.id} joined room ${roomId}`);
//       });

//       // Typing indicator
//       socket.on("typing", ({ roomId, userId }) => {
//         socket.to(roomId).emit("typing", { userId });
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

//           // Notify everyone in the room
//           this._io.to(roomId).emit("message:delete", { messageId });
//         } catch (error: any) {
//           socket.emit("error:deleteMessage", { message: error.message });
//         }
//       });

//       // Handle disconnect
//       socket.on("disconnect", () => {
//         console.log(` User disconnected: ${socket.id}`);
//       });
//     });
//   }
// }
import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/user/IMessageUseCases";

export class SocketService {
  constructor(
    private _io: Server,
    private _messageUseCases: IMessageUseCases
  ) {}

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join room
      socket.on("joinroom", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // Typing indicator ✅ send username too
      socket.on("typing", ({ roomId, userId, username }) => {
        socket.to(roomId).emit("typing", { userId, username });
      });

      socket.on("stopTyping", ({ roomId, userId }) => {
        socket.to(roomId).emit("stopTyping", { userId });
      });

      // Send message
      socket.on("sendMessage", async (data) => {
        try {
          const savedMessage = await this._messageUseCases.sendMessage(data);

          // Send back to sender ✅
          socket.emit("message:send", savedMessage);

          // Send to others in the room ✅
          socket.to(data.roomId).emit("message:new", savedMessage);
        } catch (error: any) {
          socket.emit("error:sendMessage", { message: error.message });
        }
      });

      // Delete message ✅ fix event name mismatch
      socket.on("deleteMessage", async ({ messageId, roomId }) => {
        try {
          await this._messageUseCases.deleteMessage(messageId);
          this._io.to(roomId).emit("message:deleted", { messageId }); // ✅ updated
        } catch (error: any) {
          socket.emit("error:deleteMessage", { message: error.message });
        }
      });

      // Disconnect
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}
