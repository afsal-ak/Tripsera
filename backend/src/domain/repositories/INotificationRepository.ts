import { INotification, INotificationFilter } from "@domain/entities/INotification";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
 import { PaginationInfo } from "@application/dtos/PaginationDto";


export interface INotificationRepository {
  create(notification: CreateNotificationDto): Promise<INotification>;
  
  findByUserId(userId: string, page: number,limit: number,  filters?: INotificationFilter
  ): Promise<{notification:INotification[],pagination: PaginationInfo}>;

  markAsRead(notificationId: string): Promise<INotification | null>;

  delete(notificationId: string): Promise<boolean>; 

  findAdminNotifications(
  page: number,
  limit: number,
  filters?: INotificationFilter
): Promise<{ notification: INotification[]; pagination: PaginationInfo }> 

}
