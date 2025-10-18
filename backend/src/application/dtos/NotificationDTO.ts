
// import { INotification ,IEntityType,IType} from "@domain/entities/INotification";
//  import { EnumUserRole } from "@constants/enum/userEnum";
// // Create Notification DTO
// export interface CreateNotificationDto {
//   userId?: string;
//   title: string;
//   role: EnumUserRole
//   message?: string;
//   type?:IType;
//   entityType:IEntityType
//   metadata?: Record<string, any>;

//   // optional metadata
//   bookingId?: string;
//   packageId?: string;
//   customPackageId?: string;
//   reportedId?:string;
//   walletId?:string;
//   triggeredBy?: string;
// }

// // Mark as Read DTO
// export interface MarkAsReadDto {
//   notificationId: string;
// }

// // Notification Response DTO
// export interface NotificationResponseDto {
//   _id: string;
//   userId?: string;
//   title: string;
//   message: string;
//   type: IType
//   isRead: boolean;
//   entityType:IEntityType

//   bookingId?: string;
//   packageId?: string;
//     customPackageId?: string;

//   reportedId?:string;
//   walletId?:string;

//   metadata?: Record<string, any>;

//   triggeredBy?: string;

//   createdAt: string;
//   updatedAt?: string;
// }

// export const mapToNotificationDTO = (
//   notification: INotification
// ): NotificationResponseDto => ({
//   _id: notification._id!.toString(),
//   userId: notification.userId?.toString(),
//   title: notification.title,
//   message: notification.message,
//   type: notification.type,
//   entityType: notification.entityType,
//   isRead: notification.isRead,
//   bookingId: notification.bookingId as any,
//   packageId: notification.packageId as any,
//   reportedId: notification.reportedId as any,
//   customPackageId: notification.customPackageId as any,
//   walletId: notification.walletId as any,
//   triggeredBy: notification.triggeredBy as any,
//   metadata: notification.metadata
//     ? Object.fromEntries(
//         Object.entries(notification.metadata).map(([key, value]) => [
//           key,
//           typeof value === "object" && value?.toString ? value.toString() : value,
//         ])
//       )
//     : undefined,
//   createdAt: notification.createdAt.toISOString(),
//   updatedAt: notification.updatedAt?.toISOString(),
// });

import { EnumNotificationType, EnumNotificationEntityType } from "@constants/enum/notificationEnum";
import { EnumUserRole } from "@constants/enum/userEnum";
import { INotification } from "@domain/entities/INotification";

// Create Notification DTO
export interface CreateNotificationDto {
  userId?: string;
  title: string;
  role: EnumUserRole;
  message?: string;
  type?: EnumNotificationType;
  entityType: EnumNotificationEntityType;
  metadata?: Record<string, any>;

  bookingId?: string;
  packageId?: string;
  customPackageId?: string;
  reportedId?: string;
  walletId?: string;
  triggeredBy?: string;
}

export interface MarkAsReadDto {
  notificationId: string;
}

// export interface NotificationResponseDTO{
//   _id: string;
//   userId?: string;
//   title: string;
//   message: string;
//   type: EnumNotificationType;
//   isRead: boolean;
//   entityType: EnumEntityType;

//   bookingId?: string;
//   packageId?: string;
//   customPackageId?: string;
//   reportedId?: string;
//   walletId?: string;
//   triggeredBy?: string;

//   metadata?: Record<string, any>;
//   createdAt: string;
//   updatedAt?: string;
// }


 export interface NotificationResponseDTO {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: EnumNotificationType;
  entityType: EnumNotificationEntityType;
  isRead: boolean;
  bookingId?: string;
  packageId?: string;
  customPackageId?: string;
  reportedId?: string;
  walletId?: string;
  triggeredBy?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}


// Populated Response DTO
export interface NotificationPopulatedResponseDTO extends Omit<NotificationResponseDTO, "userId" | "packageId" | "bookingId" | "triggeredBy"> {
  userId?: {
    _id: string;
    username: string;
    email: string;
  };
  packageId?: {
    _id: string;
    title: string;
    price?: number;
  };
  bookingId?: {
    _id: string;
    totalAmount?: number;
    status?: string;
  };
  triggeredBy?: {
    _id: string;
    username: string;
  };
}

