import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { INotification } from "@domain/entities/INotification";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateNotificationDto, MarkAsReadDto, NotificationResponseDto } from "@application/dtos/NotificationDTO";


export interface INotificationUseCases {


    sendNotification(data: CreateNotificationDto): Promise<INotification>
    getNotifications(userId: string, page: number, limit: number, filters: IFilter
    ): Promise<{ notification: INotification[], pagination: PaginationInfo }>

   getAdminNotifications(page: number, limit: number, filters: IFilter
   ): Promise<{ notification: INotification[], pagination: PaginationInfo }> 

    markAsRead(notificationId: string): Promise<INotification | null>
    deleteNotification(notificationId: string): Promise<boolean>
}