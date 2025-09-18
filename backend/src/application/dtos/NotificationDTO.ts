
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
  reportedId?:string;
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
    reportedId?:string;

  metadata?: Record<string, any>;

  triggeredBy?: string;

  createdAt: string;
  updatedAt?: string;
}
export const mapToNotificationDTO = (
  notification: INotification
): NotificationResponseDto => {
  return {
    _id: notification._id!.toString(),
    userId: notification.userId?.toString(),
    title: notification.title,
    message: notification.message,
    type: notification.type,
      entityType:notification.entityType,

    isRead: notification.isRead,

    // pass metadata as-is (you can stringify ObjectIds inside if needed)
    metadata: notification.metadata
      ? Object.fromEntries(
        Object.entries(notification.metadata).map(([key, value]) => [
          key,
          typeof value === "object" && value?.toString ? value.toString() : value,
        ])
      )
      : undefined,
    // metadata (convert ObjectIds to string if present)
    bookingId: notification.bookingId?.toString(),
  reportedId: notification.reportedId?.toString(),
    triggeredBy: notification.triggeredBy?.toString(),

    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt?.toISOString(),
  };
};
