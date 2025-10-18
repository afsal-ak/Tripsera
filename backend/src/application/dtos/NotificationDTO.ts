import { EnumNotificationType, EnumNotificationEntityType } from "@constants/enum/notificationEnum";
import { EnumUserRole } from "@constants/enum/userEnum";

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

