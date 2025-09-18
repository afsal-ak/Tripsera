import { INotification } from "@domain/entities/INotification";
import { CreateNotificationDto } from "@application/dtos/NotificationDTO";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";
export interface INotificationRepository {
  create(notification: CreateNotificationDto): Promise<INotification>;
  findByUserId(userId: string, page: number,limit: number,  filters?: IFilter
  ): Promise<{notification:INotification[],pagination: PaginationInfo}>;

  markAsRead(notificationId: string): Promise<INotification | null>;
  delete(notificationId: string): Promise<boolean>;
  // In NotificationRepository.ts
 findAdminNotifications(
  page: number,
  limit: number,
  filters?: IFilter
): Promise<{ notification: INotification[]; pagination: PaginationInfo }> 

}
