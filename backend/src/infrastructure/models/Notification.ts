import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '@domain/entities/INotification';
import { EnumNotificationType, EnumNotificationEntityType } from '@constants/enum/notificationEnum'; // adjust path as needed
import { EnumUserRole } from '@constants/enum/userEnum';
type NotificationDocument = INotification & Document;

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(EnumUserRole),
      default: EnumUserRole.USER,
    },

    // ✅ Use your enum values directly
    type: {
      type: String,
      enum: Object.values(EnumNotificationType),
      default: EnumNotificationType.INFO,
    },

    isRead: { type: Boolean, default: false },

    entityType: {
      type: String,
      enum: Object.values(EnumNotificationEntityType),
    },

    //  Optional metadata / references
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    customPackageId: { type: Schema.Types.ObjectId, ref: 'CustomPackage' },
    reportedId: { type: Schema.Types.ObjectId, ref: 'Package' },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'Users' },

    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDocument>(
  'Notification',
  NotificationSchema
);
