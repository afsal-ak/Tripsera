
import { INotification ,IEntityType,IType} from "@domain/entities/INotification";
import { IRole } from "@domain/entities/IUser";

// Create Notification DTO
export interface CreateNotificationDto {
  userId?: string;
  title: string;
  role: IRole
  message?: string;
  type?:IType;
  entityType:IEntityType
  metadata?: Record<string, any>;

  // optional metadata
  bookingId?: string;
  packageId?: string;
  customPackageId?: string;
  reportedId?:string;
  walletId?:string;
  triggeredBy?: string;
}

// Mark as Read DTO
export interface MarkAsReadDto {
  notificationId: string;
}

// Notification Response DTO
export interface NotificationResponseDto {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: IType
  isRead: boolean;
  entityType:IEntityType

  bookingId?: string;
  packageId?: string;
    customPackageId?: string;

  reportedId?:string;
  walletId?:string;

  metadata?: Record<string, any>;

  triggeredBy?: string;

  createdAt: string;
  updatedAt?: string;
}

export const mapToNotificationDTO = (
  notification: INotification
): NotificationResponseDto => ({
  _id: notification._id!.toString(),
  userId: notification.userId?.toString(),
  title: notification.title,
  message: notification.message,
  type: notification.type,
  entityType: notification.entityType,
  isRead: notification.isRead,
  bookingId: notification.bookingId as any,
  packageId: notification.packageId as any,
  reportedId: notification.reportedId as any,
  customPackageId: notification.customPackageId as any,
  walletId: notification.walletId as any,
  triggeredBy: notification.triggeredBy as any,
  metadata: notification.metadata
    ? Object.fromEntries(
        Object.entries(notification.metadata).map(([key, value]) => [
          key,
          typeof value === "object" && value?.toString ? value.toString() : value,
        ])
      )
    : undefined,
  createdAt: notification.createdAt.toISOString(),
  updatedAt: notification.updatedAt?.toISOString(),
});
