
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { INotification, INotificationFilter } from "@domain/entities/INotification";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateNotificationDto, MarkAsReadDto } from "@application/dtos/NotificationDTO";
import { NotificationResponseDTO,NotificationPopulatedResponseDTO } from "@application/dtos/NotificationDTO";
 import { IUserRepository } from "@domain/repositories/IUserRepository";
import { getNotificationSocketService } from "@infrastructure/sockets/NotificationSocketService";
 import { EnumUserRole } from "@constants/enum/userEnum";
import { NotificationMapper } from "@application/mappers/NotificationMapper ";

export class NotificationUseCases implements INotificationUseCases {
  constructor(
    private readonly _notificationRepo: INotificationRepository,
    private readonly _userRepo: IUserRepository,
   ) { }


  async sendNotification(data: CreateNotificationDto):
   Promise<NotificationPopulatedResponseDTO> {

  
    const notification = await this._notificationRepo.create(data);

  // console.log(notification, 'payload notification')
    const socketService = getNotificationSocketService();

    if (notification.role === EnumUserRole.ADMIN) {
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

    return NotificationMapper.toPopulatedResponseDTO(notification);
  }

  async getNotifications(userId: string, page: number, limit: number, filters: INotificationFilter): Promise<{ notification: NotificationPopulatedResponseDTO[], pagination: PaginationInfo }> {
      const result=  await this._notificationRepo.findByUserId(userId, page, limit, filters)
      return{
        notification:result.notification.map(NotificationMapper.toPopulatedResponseDTO),
        pagination:result.pagination
      }
  }

  async getAdminNotifications(page: number, limit: number, filters: INotificationFilter): Promise<{ notification: NotificationPopulatedResponseDTO[], pagination: PaginationInfo }> {
    const result= await this._notificationRepo.findAdminNotifications(page, limit, filters)
    return{
        notification:result.notification.map(NotificationMapper.toPopulatedResponseDTO),
        pagination:result.pagination
      }
  }

  async markAsRead(notificationId: string): Promise<NotificationResponseDTO | null> {
    const notification= await this._notificationRepo.markAsRead(notificationId);
    return notification? NotificationMapper.toResponseDTO(notification):null

  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    return await this._notificationRepo.delete(notificationId);
  }
}