
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { INotification, INotificationFilter } from "@domain/entities/INotification";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateNotificationDto, MarkAsReadDto, NotificationResponseDto } from "@application/dtos/NotificationDTO";
import { NotificationSocketService } from "@infrastructure/sockets/NotificationSocketService";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { getNotificationSocketService } from "@infrastructure/sockets/NotificationSocketService";
import { IPackageRepository } from "@domain/repositories/IPackageRepository";

export class NotificationUseCases implements INotificationUseCases {
  constructor(
    private readonly _notificationRepo: INotificationRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _packageRepo: IPackageRepository,
  ) { }


  async sendNotification(data: CreateNotificationDto): Promise<INotification> {

    // let message = "";
    // if (data.entityType === "booking") {
    //   const user = data.triggeredBy ? await this._userRepo.findById(data.triggeredBy) : null;
    //   const packageData = data.packageId ? await this._packageRepo.findById(data.packageId) : null;
    //   message = `${user?.username} booked ${packageData?.title ?? "a package"}`;
    // }


    //  if (data.entityType === "follow") {
    //   const user = data.triggeredBy ? await this._userRepo.findById(data.triggeredBy) : null;

    //   message = `${user?.username} started following you`;
    // }

    // else {
    //   message = data.message || "New notification";
    // }

    //  Save the notification in DB
    // const notificationPayload = {
    //   ...data,
      
    // };
   // console.log(data, 'usecase')
    const notification = await this._notificationRepo.create(data);

  // console.log(notification, 'payload notification')
    const socketService = getNotificationSocketService();

    if (notification.role === "admin") {
      //console.log('jjjjjjjjjjjj')
      const admins = await this._userRepo.getAllAdmins();
      for (const admin of admins) {
        console.log(admin._id, 'asdmin')

        socketService.emitNotificationToUser(admin._id!.toString(), notification);
      }
    } else {
      console.log(data.userId,'emieets')
      socketService.emitNotificationToUser(data.userId!.toString(), notification);
    }

    return notification;
  }

  async getNotifications(userId: string, page: number, limit: number, filters: INotificationFilter): Promise<{ notification: INotification[], pagination: PaginationInfo }> {
    return this._notificationRepo.findByUserId(userId, page, limit, filters)
  }

  async getAdminNotifications(page: number, limit: number, filters: INotificationFilter): Promise<{ notification: INotification[], pagination: PaginationInfo }> {
    return this._notificationRepo.findAdminNotifications(page, limit, filters)
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await this._notificationRepo.markAsRead(notificationId);

  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    return await this._notificationRepo.delete(notificationId);
  }
}