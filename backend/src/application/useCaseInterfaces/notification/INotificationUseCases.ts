 import {  INotificationFilter } from "@domain/entities/INotification";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
import { NotificationResponseDTO,NotificationPopulatedResponseDTO } from "@application/dtos/NotificationDTO";

export interface INotificationUseCases {


    sendNotification(data: CreateNotificationDto): Promise<NotificationPopulatedResponseDTO>
    getNotifications(userId: string, page: number, limit: number, filters: INotificationFilter
    ): Promise<{ notification: NotificationPopulatedResponseDTO[], pagination: PaginationInfo }>

    getAdminNotifications(page: number, limit: number, filters: INotificationFilter
    ): Promise<{ notification: NotificationPopulatedResponseDTO[], pagination: PaginationInfo }>

    markAsRead(notificationId: string): Promise<NotificationResponseDTO | null>
    deleteNotification(notificationId: string): Promise<boolean>
}