import mongoose, { Schema, model, Document } from 'mongoose';
import { IBooking, ITraveler } from '@domain/entities/IBooking';

type IBookingDocument = IBooking & Document;

// Traveler schema
const TravelerSchema = new Schema<ITraveler>(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    idType: { type: String, enum: ["aadhaar", "pan", "passport"], required: true },
    idNumber: { type: String, required: true },
  },
  { _id: false }
);

// History Schemas
const TravelerHistorySchema = new Schema(
  {
    traveler: { type: TravelerSchema, required: true },
    action: { type: String, enum: ["added", "removed", "updated"], required: true },
    changedBy: { type: String, required: false },
    changedAt: { type: Date, required: false },
        note: { type: String },

  },
  { _id: false }
);

const TravelDateHistorySchema = new Schema(
  {
    oldDate: { type: Date, required: true },
    newDate: { type: Date, required: true },
    action: { type: String, enum: ["preponed", "postponed"], required: true },
    changedBy: { type: String, required: false },
    changedAt: { type: Date, required: true },
        note: { type: String },

  },
  { _id: false }
);

const AdjustmentHistorySchema = new Schema(
  {
    oldAmount: { type: Number, required: true },
    newAmount: { type: Number, required: true },
    refundAmount: { type: Number },
    extraAmount: { type: Number },
    reason: { type: String, required: true },
    processedBy: { type: String, required: true },
    processedAt: { type: Date, required: true },
  },
  { _id: false }
);

const BookingHistorySchema = new Schema(
  {
    action: { type: String, enum: ["traveler_removed", "traveler_added", "date_changed", "status_changed", "amount_changed"], required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    changedBy: { type: String, required: true },
    changedAt: { type: Date, required: true },
    note: { type: String },
  },
  { _id: false }
);

//  Booking schema
const BookingSchema = new Schema<IBookingDocument>(
  {
    bookingCode: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },

    travelers: { type: [TravelerSchema], required: true },
    travelerHistory: { type: [TravelerHistorySchema], default: [] },

    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    paymentMethod: { type: String, enum: ['razorpay', 'wallet', 'wallet+razorpay'], required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },

    bookingStatus: { type: String, enum: ['confirmed', 'booked', 'cancelled', 'pending'], default: 'pending' },
    adminNote: { type: String, default: null },
    cancelledBy: { type: String },
    cancelReason: { type: String },

    walletUsed: { type: Boolean, default: false },
    walletAmountUsed: { type: Number, default: 0 },
    amountPaid: { type: Number, required: true },

    contactDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String },
      email: { type: String, required: true },
    },

    travelDate: { type: Date, required: true },
    previousDates: { type: [TravelDateHistorySchema], default: [] },
    rescheduleCount: { type: Number, default: 0 },

    adjustments: { type: [AdjustmentHistorySchema], default: [] },
    history: { type: [BookingHistorySchema], default: [] },

    razorpay: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BookingModel = model<IBookingDocument>('Booking', BookingSchema);
