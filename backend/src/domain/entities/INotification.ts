import { Types } from 'mongoose';
import { EnumUserRole } from '@constants/enum/userEnum';
import { EnumNotificationType, EnumNotificationEntityType } from '@constants/enum/notificationEnum';

export interface INotification {
  _id: string;
  userId?: Types.ObjectId;
  role: EnumUserRole;
  title: string;
  message: string;
  entityType: EnumNotificationEntityType;
  type: EnumNotificationType;
  isRead: boolean;
  packageId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  reportedId?: Types.ObjectId;
  customPackageId?: Types.ObjectId;
  walletId?: Types.ObjectId;
  metadata?: Record<string, any>;
  triggeredBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationFilter {
  status?: string;
  type?: EnumNotificationType;
  entityType?: EnumNotificationEntityType;
}
