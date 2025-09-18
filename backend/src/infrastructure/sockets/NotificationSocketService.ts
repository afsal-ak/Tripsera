// import { Server, Socket } from "socket.io";
// import { NotificationUseCases } from "@application/usecases/user/notificationUseCases";
// import { SOCKET_NOTIFICATION_EVENTS } from "./events";

// export class NotificationSocketService {
//     constructor(
//         private _io: Server,
//         private _notificationUseCases: NotificationUseCases
        
//     ) { }


//     public initialize() {
//         this._io.on('connection', (socket: Socket) => {

//             console.log(` User connected to notification socket: ${socket.id}`);

//             socket.on(SOCKET_NOTIFICATION_EVENTS.JOIN, (userId: string) => {
//                 socket.join(userId)
//                 console.log(`User ${socket.id} joined notifications for ${userId}`);

//             });

//             socket.on(SOCKET_NOTIFICATION_EVENTS.MARK_AS_READ,
//                 async ({ notificationId, userId }) => {
//                     try {
//                         const updated = await this._notificationUseCases.markAsRead(notificationId)

//                         if (updated) {
//                             this._io.to(userId).emit(SOCKET_NOTIFICATION_EVENTS.NOTIFICATION_READ, { notificationId })
//                         }
//                     } catch (error: any) {
//                         socket.emit("error:notification", { message: error.message })
//                     }
//                 }
//             )

//             socket.on(
//                 SOCKET_NOTIFICATION_EVENTS.FETCH,
//                 async ({ userId, page, limit }) => {
//                     try {
//                         const { notification, pagination } =
//                             await this._notificationUseCases.getNotifications(userId, page, limit, {});
//                         socket.emit(SOCKET_NOTIFICATION_EVENTS.FETCH_RESULT, {
//                             notification,
//                             pagination,
//                         });
//                     } catch (error: any) {
//                         socket.emit("error:notification", { message: error.message });
//                     }
//                 }
//             );

//             socket.on("disconnect", () => {
//                 console.log(` User disconnected from notification socket: ${socket.id}`);

//             })

//         })
//     }

//      /**
//    * Emit a new notification to a user (e.g. booking confirmed, new booking)
//    */
//   public emitNotificationToUser(userId: string, notification: any) {
//     console.log(notification,'socke tnotification')
//     console.log(userId,'socke userid')
//       console.log("NotificationSocketService created, io:", !!this._io);

//     this._io.to(userId).emit(SOCKET_NOTIFICATION_EVENTS.NEW, notification);
//   }


// }


import { Server, Socket } from "socket.io";
import { NotificationUseCases } from "@application/usecases/notification/notificationUseCases";
import { SOCKET_NOTIFICATION_EVENTS } from "./events";

export class NotificationSocketService {
  constructor(
    private _io: Server,
    private _notificationUseCases: NotificationUseCases
  ) {}
  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log(` User connected to notification socket: ${socket.id}`);

      socket.on(SOCKET_NOTIFICATION_EVENTS.JOIN, (userId: string) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined notifications for ${userId}`);
      });

      socket.on(
        SOCKET_NOTIFICATION_EVENTS.MARK_AS_READ,
        async ({ notificationId, userId }) => {
          try {
            const updated = await this._notificationUseCases.markAsRead(notificationId);

            if (updated) {
              this._io
                .to(userId)
                .emit(SOCKET_NOTIFICATION_EVENTS.NOTIFICATION_READ, { notificationId });
            }
          } catch (error: any) {
            socket.emit("error:notification", { message: error.message });
          }
        }
      );

      socket.on(
        SOCKET_NOTIFICATION_EVENTS.FETCH,
        async ({ userId, page, limit }) => {
          try {
            const { notification, pagination } =
              await this._notificationUseCases.getNotifications(userId, page, limit, {});
            socket.emit(SOCKET_NOTIFICATION_EVENTS.FETCH_RESULT, {
              notification,
              pagination,
            });
          } catch (error: any) {
            socket.emit("error:notification", { message: error.message });
          }
        }
      );

      socket.on("disconnect", () => {
        console.log(` User disconnected from notification socket: ${socket.id}`);
      });
    });
  }

  /**
   * Emit a new notification to a user (e.g. booking confirmed, new booking)
   */
  public emitNotificationToUser(userId: string, notification: any) {
    console.log(" Sending notification:", notification, "to user:", userId);
    this._io.to(userId).emit(SOCKET_NOTIFICATION_EVENTS.NEW, notification);
  }
}

/**
 * Singleton wrapper
 */
let notificationSocketService: NotificationSocketService | null = null;

export const initNotificationSocketService = (
  io: Server,
  useCases: NotificationUseCases
) => {
  if (!notificationSocketService) {
    notificationSocketService = new NotificationSocketService(io, useCases);
    notificationSocketService.initialize();
  }
  return notificationSocketService;
};

export const getNotificationSocketService = (): NotificationSocketService => {
  if (!notificationSocketService) {
    throw new Error("NotificationSocketService not initialized! Call initNotificationSocketService first.");
  }
  return notificationSocketService;
};
