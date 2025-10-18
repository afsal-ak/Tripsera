import { Socket, Server } from "socket.io";
import { IMessageUseCases } from "@application/useCaseInterfaces/chat/IMessageUseCases";
import { SOCKET_EVENTS, SOCKET_WEBRTC_EVENTS } from "./events";
import { IChatRoomUseCase } from "@application/useCaseInterfaces/chat/IChatRoomUseCases";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { EnumCallStatus, EnumMessageType } from "@constants/enum/messageEnum";

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
            type: EnumMessageType.VIDEO,
            content: `${callType} call initiated`,
            callInfo: {
              callType,
              status: EnumCallStatus.INITIATED,
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
              callInfo: { status: EnumCallStatus.MISSED },
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
                status: EnumCallStatus.ANSWERED,
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

        let newStatus= EnumCallStatus.ENDED

        if (currentStatus === EnumCallStatus.INITIATED) {
          newStatus = EnumCallStatus.CANCELLED
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
