import mongoose, { Schema, Document } from "mongoose";
import { INotification } from "@domain/entities/INotification";


type NotificationDocument = INotification & Document;

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, default: 'user' },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error", "request"],
      default: "info",
    },
    isRead: { type: Boolean, default: false },
    entityType: { type: String },
    // optional metadata
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    packageId: { type: Schema.Types.ObjectId, ref: "Package" },
    customPackageId: { type: Schema.Types.ObjectId, ref: "CustomPackage" },
    reportedId: { type: Schema.Types.ObjectId, ref: "Package" },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed, // can hold bookingId, packageId, walletId, etc.
      default: {},
    },
    triggeredBy: { type: Schema.Types.ObjectId, ref: "Users" }, // e.g., who booked
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
