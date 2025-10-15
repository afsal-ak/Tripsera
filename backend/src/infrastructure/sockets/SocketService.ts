
// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
// import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from "./events";

// import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
// import { ICallUseCases } from "@application/useCaseInterfaces/call/ICallUseCases";
// export class SocketService {
//   private onlineUsers: Map<string, string>; // userId -> socketId

//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases,
//     private _chatRoomUseCases: IChatRoomUseCase,
//     private _callUseCases: ICallUseCases
//   ) {
//     this.onlineUsers = new Map();
//   }

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(`User connected: ${socket.id}`);


//       socket.on(SOCKET_EVENTS.USER_CONNECTED, ({ userId }) => {
//         this.onlineUsers.set(userId, socket.id);

//         // notify all clients
//         this._io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

//         // send the current list of online users to the new user
//         socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
//           users: Array.from(this.onlineUsers.keys()),
//         });

//         console.log(`User ${userId} is now online`);
//       });

//       socket.on(SOCKET_EVENTS.USER_DISCONNECTED, ({ userId }) => {
//         this.onlineUsers.delete(userId);
//         this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
//         console.log(`User ${userId} disconnected manually`);
//       });

//       socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
//         socket.join(roomId);

//         this.onlineUsers.set(userId, socket.id);

//         // notify room participants only
//         socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

//         // send online list to this client
//         socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
//           users: Array.from(this.onlineUsers.keys()),
//         });

//         console.log(`User ${userId} joined room ${roomId}`);
//       });


//       socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
//         socket.leave(roomId);

//         socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });

//         console.log(`User ${userId} left room ${roomId}`);
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

//           //   Broadcast to active room participants (except sender)
//           socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);

//           // . Fetch participants from ChatRoom
//           const chatRoom = await this._chatRoomUseCases.findById(data.roomId);
//           const participants: string[] = (chatRoom?.participants || []).map((id: any) =>
//             id.toString()
//           );

//           //   Notify only inactive participants (not in room)
//           participants
//             .filter((id) => id !== data.senderId)
//             .forEach((userId) => {
//               const socketId = this.onlineUsers.get(userId);
//               if (socketId) {
//                 // only send if user is NOT already in the room
//                 const rooms = this._io.sockets.sockets.get(socketId)?.rooms;
//                 if (!rooms?.has(data.roomId)) {
//                   this._io.to(socketId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
//                 }
//               }
//             });
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
//         socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, { messageId, userId });
//       });

//       //WEBRTC EVENTS

//       // socket.on(SOCKET_WEBRTC_EVENTS.OFFER, async ({ to, fromUserId, roomId, callType, offer }) => {
//       //   const targetSocket = this.onlineUsers.get(to);
//       //   console.log({ to, fromUserId, roomId, callType, offer }, 'video call')
//       //   // Create a new call record
//       //   const call = await this._callUseCases.createCall({
//       //     callerId: fromUserId,
//       //     receiverId: to,
//       //     roomId,
//       //     callType,
//       //     startedAt: new Date(),
//       //   });

//       //   if (targetSocket) {
//       //     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.OFFER,
//       //       {
//       //         from: fromUserId,
//       //         offer,
//       //         callType,
//       //         callId: call._id
//       //       })
//       //   } else {
//       //     await this._callUseCases.markMissed(call._id!.toString())
//       //   }
//       // })

//       // socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ to, answer, callId }) => {
//       //   const targetSocket = this.onlineUsers.get(to);
//       //   if (targetSocket) {
//       //     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.ANSWER, { from: socket.id, answer });
//       //     await this._callUseCases.markAnswered(callId)
//       //   }
//       // });

//       // socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ to, candidate }) => {
//       //   const targetSocket = this.onlineUsers.get(to);
//       //   if (targetSocket) {
//       //     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, { from: socket.id, candidate });
//       //   }
//       // });

//       // // socket.on(SOCKET_WEBRTC_EVENTS.END, async ({ callId }) => {
//       // //   await this._callUseCases.markEnded(callId)
//       // // })
//       // socket.on(SOCKET_WEBRTC_EVENTS.END, async ({ callId, to }) => {
//       //   await this._callUseCases.markEnded(callId);
//       //   const targetSocket = this.onlineUsers.get(to);
//       //   if (targetSocket) {
//       //     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.END, { callId });
//       //   }
//       // });
//       // OFFER
// // socket.on(SOCKET_WEBRTC_EVENTS.OFFER, async ({ to, fromUserId, roomId, callType, offer }) => {
// //   const targetSocket = this.onlineUsers.get(to);
// //   console.log({ to, fromUserId, roomId, callType, offer }, 'video call');

// //   // Create a new call record
// //   const call = await this._callUseCases.createCall({
// //     callerId: fromUserId,
// //     receiverId: to,
// //     roomId,
// //     callType,
// //     startedAt: new Date(),
// //   });

// //   if (targetSocket) {
// //     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.OFFER, {
// //       from: fromUserId, // send userId, not socket.id
// //       roomId,
// //       callId: call._id,
// //       offer,
// //       callType,
// //     });
// //   } else {
// //     await this._callUseCases.markMissed(call._id!.toString());
// //   }
// // });
// socket.on(SOCKET_WEBRTC_EVENTS.OFFER, async ({ to, fromUserId, roomId, callType, offer }) => {
//   const targetSocket = this.onlineUsers.get(to);

//   // Create call record in DB
//   const call = await this._callUseCases.createCall({ callerId: fromUserId, receiverId: to, roomId, callType, startedAt: new Date() });

//   if (targetSocket) {
//     // Emit OFFER to callee
//     console.log("Sending OFFER to socket:", targetSocket, "for user:", to);

//     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.OFFER, { from: fromUserId, offer, callType, callId: call._id });
//   } else {
//     // If callee is offline, mark as missed
//     await this._callUseCases.markMissed(call._id!.toString());
//   }
// });

// // ANSWER
// socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ to, fromUserId, answer, callId }) => {
//   const targetSocket = this.onlineUsers.get(to);
//   if (targetSocket) {
//     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
//       from: fromUserId, // send userId
//       answer,
//       callId,
//     });
//     await this._callUseCases.markAnswered(callId);
//   }
// });

// // CANDIDATE
// socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ to, fromUserId, candidate }) => {
//   const targetSocket = this.onlineUsers.get(to);
//   if (targetSocket) {
//     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, {
//       from: fromUserId, // send userId
//       candidate,
//     });
//   }
// });

// // END
// socket.on(SOCKET_WEBRTC_EVENTS.END, async ({ callId, to, fromUserId }) => {
//   await this._callUseCases.markEnded(callId);
//   const targetSocket = this.onlineUsers.get(to);
//   if (targetSocket) {
//     this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.END, {
//       from: fromUserId,
//       callId,
//     });
//   }
// });

//       socket.on("disconnect", () => {
//         const disconnectedUser = Array.from(this.onlineUsers.entries())
//           .find(([_, sId]) => sId === socket.id);

//         if (disconnectedUser) {
//           const [userId] = disconnectedUser;
//           this.onlineUsers.delete(userId);

//           this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
//           console.log(`User ${userId} disconnected (auto)`);
//         }

//         console.log(`Socket disconnected: ${socket.id}`);
//       });
//     });
//   }
// }




// import { Socket, Server } from "socket.io";
// import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
// import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from "./events";

// import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
// import { ICallUseCases } from "@application/useCaseInterfaces/call/ICallUseCases";
// import { IUserRepository } from "@domain/repositories/IUserRepository";
// export class SocketService {
//   private onlineUsers: Map<string, string>; // userId -> socketId

//   constructor(
//     private _io: Server,
//     private _messageUseCases: IMessageUseCases,
//     private _chatRoomUseCases: IChatRoomUseCase,
//     private _userRepository: IUserRepository,
//     private _callUseCases: ICallUseCases
//   ) {
//     this.onlineUsers = new Map();
//   }

//   public initialize() {
//     this._io.on("connection", (socket: Socket) => {
//       console.log(`User connected: ${socket.id}`);


//       socket.on(SOCKET_EVENTS.USER_CONNECTED, ({ userId }) => {
//         this.onlineUsers.set(userId, socket.id);

//         // notify all clients
//         this._io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

//         // send the current list of online users to the new user
//         socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
//           users: Array.from(this.onlineUsers.keys()),
//         });

//         console.log(`User ${userId} is now online`);
//       });

//       socket.on(SOCKET_EVENTS.USER_DISCONNECTED, ({ userId }) => {
//         this.onlineUsers.delete(userId);
//         this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
//         console.log(`User ${userId} disconnected manually`);
//       });

//       socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
//         socket.join(roomId);

//         this.onlineUsers.set(userId, socket.id);

//         // notify room participants only
//         socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });

//         // send online list to this client
//         socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
//           users: Array.from(this.onlineUsers.keys()),
//         });

//         console.log(`User ${userId} joined room ${roomId}`);
//       });


//       socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
//         socket.leave(roomId);

//         socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });

//         console.log(`User ${userId} left room ${roomId}`);
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

//           //   Broadcast to active room participants (except sender)
//           socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);

//           // . Fetch participants from ChatRoom
//           const chatRoom = await this._chatRoomUseCases.findById(data.roomId);
//           const participants: string[] = (chatRoom?.participants || []).map((id: any) =>
//             id.toString()
//           );

//           //   Notify only inactive participants (not in room)
//           participants
//             .filter((id) => id !== data.senderId)
//             .forEach((userId) => {
//               const socketId = this.onlineUsers.get(userId);
//               if (socketId) {
//                 // only send if user is NOT already in the room
//                 const rooms = this._io.sockets.sockets.get(socketId)?.rooms;
//                 if (!rooms?.has(data.roomId)) {
//                   this._io.to(socketId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);
//                 }
//               }
//             });
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
//         socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE_READ, { messageId, userId });
//       });

//       //WEBRTC EVENTS

//       socket.on(SOCKET_WEBRTC_EVENTS.OFFER, async ({ to, fromUserId, roomId, callType, offer }) => {
//         const targetSocket = this.onlineUsers.get(to);
//         const caller = await this._userRepository.findById(fromUserId)
//         console.log(caller, 'from id socket')
//         // Create call record in DB
//         const call = await this._callUseCases.createCall(
//           {
//             callerId: fromUserId,
//             receiverId: to,
//             roomId,
//             callType,
//             startedAt: new Date()

//           });

//         if (targetSocket) {
//           // Emit OFFER to callee
//           console.log("Sending OFFER to socket:", targetSocket, "for user:", to);

//           this._io.to(targetSocket).emit(
//             SOCKET_WEBRTC_EVENTS.OFFER,
//             {
//               from: fromUserId,
//               fromUserName: caller?.username,
//               fromUserAvatar: caller?.profileImage?.url||null,
//               offer, callType,
//               callId: call._id
//             });
//         } else {
//           // If callee is offline, mark as missed
//           await this._callUseCases.markMissed(call._id!.toString());
//         }
//       });

//       // ANSWER
//       socket.on(SOCKET_WEBRTC_EVENTS.ANSWER, async ({ to, fromUserId, answer, callId }) => {
//         console.log({ to, fromUserId, answer, callId },'anwered in scoekt');

//         const targetSocket = this.onlineUsers.get(to);
//         if (targetSocket) {
//           this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
//             from: fromUserId, // send userId
//             answer,
//             callId,
//           });
//           await this._callUseCases.markAnswered(callId);
//         }
//       });

//       // CANDIDATE
//       socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ to, fromUserId, candidate }) => {

//         const targetSocket = this.onlineUsers.get(to);
//         if (targetSocket) {
//           this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, {
//             from: fromUserId, // send userId
//             candidate,
//           });
//         }
//       });

//       // END
//       socket.on(SOCKET_WEBRTC_EVENTS.END, async ({ callId, to, fromUserId }) => {
//                         console.log({ to, fromUserId, callId },'end in scoekt');

//         await this._callUseCases.markEnded(callId);
//         const targetSocket = this.onlineUsers.get(to);
//         if (targetSocket) {
//           this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.END, {
//             from: fromUserId,
//             callId,
//           });
//         }
//       });

//       socket.on("disconnect", () => {
//         const disconnectedUser = Array.from(this.onlineUsers.entries())
//           .find(([_, sId]) => sId === socket.id);

//         if (disconnectedUser) {
//           const [userId] = disconnectedUser;
//           this.onlineUsers.delete(userId);

//           this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
//           console.log(`User ${userId} disconnected (auto)`);
//         }

//         console.log(`Socket disconnected: ${socket.id}`);
//       });
//     });
//   }
// }

import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from "./events";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatUseCases";
import { IUserRepository } from "@domain/repositories/IUserRepository";

export class SocketService {
  private onlineUsers: Map<string, string>;

  constructor(
    private _io: Server,
    private _messageUseCases: IMessageUseCases,
    private _chatRoomUseCases: IChatRoomUseCase,
    private _userRepository: IUserRepository
  ) {
    this.onlineUsers = new Map();
  }

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      //   User Connect  
      socket.on(SOCKET_EVENTS.USER_CONNECTED, ({ userId }) => {
        this.onlineUsers.set(userId, socket.id);
        this._io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });
        socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
          users: Array.from(this.onlineUsers.keys()),
        });
      });

      socket.on(SOCKET_EVENTS.USER_DISCONNECTED, ({ userId }) => {
        this.onlineUsers.delete(userId);
        this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
      });

      //   Join    
      socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userId }) => {
        socket.join(roomId);
        this.onlineUsers.set(userId, socket.id);
        socket.to(roomId).emit(SOCKET_EVENTS.USER_ONLINE, { userId });
        socket.emit(SOCKET_EVENTS.CURRENT_ONLINE_USERS, {
          users: Array.from(this.onlineUsers.keys()),
        });
        console.log(`User ${userId} joined room ${roomId}`);
      });

      socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
      });

      //   Typing 
      socket.on(SOCKET_EVENTS.TYPING, ({ roomId, userId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.TYPING, { userId, username });
      });

      socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId, userId }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.STOP_TYPING, { userId });
      });

      //   Normal Messages  
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
        try {
          const savedMessage = await this._messageUseCases.sendMessage(data);

          socket.emit(SOCKET_EVENTS.MESSAGE_SEND, savedMessage);
          socket.to(data.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, savedMessage);

          // Notify inactive participants
          const chatRoom = await this._chatRoomUseCases.findById(data.roomId);
          const participants: string[] = (chatRoom?.participants || []).map((id: any) =>
            id.toString()
          );

          participants
            .filter((id) => id !== data.senderId)
            .forEach((userId) => {
              const socketId = this.onlineUsers.get(userId);
              if (socketId) {
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

      //   WEBRTC / CALL EVENTS   

      // OFFER (Start Call)
      socket.on(
        SOCKET_WEBRTC_EVENTS.OFFER,
        async ({ to, fromUserId, roomId, callType, offer }) => {
          const targetSocket = this.onlineUsers.get(to);
          const caller = await this._userRepository.findById(fromUserId);

          //  Create a call message
          const callMessage = await this._messageUseCases.sendMessage({
            roomId,
            senderId: fromUserId,
            type: "call",
            content: `${callType} call initiated`,
            callInfo: {
              callType,
              status: "initiated",
              startedAt: new Date(),
              callerId: fromUserId,
              receiverId: to,
            },
          });

          if (targetSocket) {
            this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.OFFER, {
              from: fromUserId,
              fromUserName: caller?.username,
              fromUserAvatar: caller?.profileImage?.url || null,
              offer,
              callType,
              callId: callMessage._id,
            });

            socket.emit(SOCKET_EVENTS.MESSAGE_SEND, callMessage);
            // socket.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, callMessage);

          } else {

            const message = await this._messageUseCases.updateMessage(callMessage._id!.toString(), {
              callInfo: { status: "missed" },
            });
            this._io.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

          }
        }
      );

      // ANSWER
      socket.on(
        SOCKET_WEBRTC_EVENTS.ANSWER,
        async ({ to, fromUserId, answer, callId }) => {
          const targetSocket = this.onlineUsers.get(to);
          if (targetSocket) {
            this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.ANSWER, {
              from: fromUserId,
              answer,
              callId,
            });

            console.log({
              from: fromUserId,
              answer,
              callId,
            }, 'anser console')
            await this._messageUseCases.updateMessage(callId, {
              callInfo: {
                status: "answered",
                startedAt: new Date(),
              },
            });

          }
        }
      );

      //   CANDIDATE
      socket.on(SOCKET_WEBRTC_EVENTS.CANDIDATE, ({ to, fromUserId, candidate }) => {
        const targetSocket = this.onlineUsers.get(to);
        if (targetSocket) {
          this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.CANDIDATE, {
            from: fromUserId,
            candidate,
          });
        }
      });


      // END CALL
      socket.on(SOCKET_WEBRTC_EVENTS.END, async ({ callId, to, fromUserId, roomId }) => {
        console.log({ callId, to, fromUserId, roomId }, "call ended or cancelled");

        const targetSocket = this.onlineUsers.get(to);

        const existingMsg = callId ? await this._messageUseCases.getMessageById(callId) : null;
        const currentStatus = existingMsg?.callInfo?.status;

        let newStatus: "missed" | "initiated" | "answered" | "ended" | "rejected" | "cancelled" = "ended";

        if (currentStatus === "initiated") {
          newStatus = "cancelled";
        }

        const updatedMsg = await this._messageUseCases.updateMessage(callId, {
          callInfo: { status: newStatus },
        });

        if (targetSocket) {
          this._io.to(targetSocket).emit(SOCKET_WEBRTC_EVENTS.END, {
            from: fromUserId,
            callId,
            reason: newStatus,
          });
        }

        this._io.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, updatedMsg);
        socket.emit(SOCKET_EVENTS.MESSAGE_SEND, updatedMsg);

        console.log(` Call ${callId} ${newStatus} by ${fromUserId}`);
      });


      //   Disconnect  
      socket.on("disconnect", () => {
        const disconnectedUser = Array.from(this.onlineUsers.entries()).find(
          ([_, sId]) => sId === socket.id
        );
        if (disconnectedUser) {
          const [userId] = disconnectedUser;
          this.onlineUsers.delete(userId);
          this._io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
        }
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
}
