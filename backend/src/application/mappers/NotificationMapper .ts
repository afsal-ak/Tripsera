import { INotification } from '@domain/entities/INotification';
import { INotificationPopulated } from '@infrastructure/db/types.ts/INotificationPopulated';
import {
  NotificationResponseDTO,
  NotificationPopulatedResponseDTO,
} from '@application/dtos/NotificationDTO';
import { EnumNotificationType, EnumNotificationEntityType } from '@constants/enum/notificationEnum';

/**
 * NotificationMapper
 * Converts domain entities → DTOs (normal & populated)
 */
export abstract class NotificationMapper {
  /**
   * Converts a plain notification document into a standard response DTO.
   */
  static toResponseDTO(notification: INotification): NotificationResponseDTO {
    return {
      _id: notification._id.toString(),
      userId: notification.userId?.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type || EnumNotificationType.INFO,
      entityType: notification.entityType || EnumNotificationEntityType.BOOKING,
      isRead: notification.isRead ?? false,
      bookingId: notification.bookingId?.toString(),
      packageId: notification.packageId?.toString(),
      customPackageId: notification.customPackageId?.toString(),
      reportedId: notification.reportedId?.toString(),
      walletId: notification.walletId?.toString(),
      triggeredBy: notification.triggeredBy?.toString(),
      metadata: notification.metadata
        ? Object.fromEntries(
            Object.entries(notification.metadata).map(([key, value]) => [
              key,
              typeof value === 'object' && value?.toString ? value.toString() : value,
            ])
          )
        : undefined,
      createdAt: notification.createdAt?.toISOString() || '',
      updatedAt: notification.updatedAt?.toISOString(),
    };
  }

  /**
   * Converts a populated notification document (with user, package, booking, etc.)
   * into a rich response DTO.
   */
  static toPopulatedResponseDTO(
    notification: INotificationPopulated
  ): NotificationPopulatedResponseDTO {
    return {
      _id: notification._id.toString(),
      userId: notification.userId
        ? {
            _id: notification.userId._id.toString(),
            username: notification.userId.username,
            email: notification.userId.email,
          }
        : undefined,
      title: notification.title,
      message: notification.message,
      type: notification.type || EnumNotificationType.INFO,
      entityType: notification.entityType || EnumNotificationEntityType.BOOKING,
      isRead: notification.isRead ?? false,
      packageId: notification.packageId
        ? {
            _id: notification.packageId._id.toString(),
            title: notification.packageId.title,
            price: notification.packageId.price,
          }
        : undefined,
      bookingId: notification.bookingId
        ? {
            _id: notification.bookingId._id.toString(),
            totalAmount: notification.bookingId.totalAmount,
            status: notification.bookingId.status,
          }
        : undefined,
      triggeredBy: notification.triggeredBy
        ? {
            _id: notification.triggeredBy._id.toString(),
            username: notification.triggeredBy.username,
          }
        : undefined,
      metadata: notification.metadata
        ? Object.fromEntries(
            Object.entries(notification.metadata).map(([key, value]) => [
              key,
              typeof value === 'object' && value?.toString ? value.toString() : value,
            ])
          )
        : undefined,
      createdAt: notification.createdAt?.toISOString() || '',
      updatedAt: notification.updatedAt?.toISOString(),
    };
  }
}
