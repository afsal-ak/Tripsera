import mongoose, { Schema, model, Document } from "mongoose";
import { IBooking } from "@domain/entities/IBooking";
 
interface IBookingDocument extends   Omit<IBooking, '_id'>, Document {
      _id: mongoose.Types.ObjectId;

}
const TravelerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    id: { type: String, required: true }
  },
  { _id: false }
);


const BookingSchema = new Schema<IBookingDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
       travelers: {
         type: [TravelerSchema],
          required: true 
        },

    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: { type: String },
    paymentMethod: {
        type: String,
        enum: ["razorpay", "wallet"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "pending", "failed"],
        default: "pending"
    },
    bookingStatus: {
        type: String,
        enum: ["confirmed","booked", "cancelled","pending"],
        default: "pending"
    },
    walletUsed: {
  type: Number,
  default: 0,
},
amountPaid: {
  type: Number,
  required: true,
},

    
    cancelReason: { type: String },
    contactDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String },
      email: { type: String, required: true },
    },
    razorpay: {
        orderId: { type: String },
        paymentId: { type: String },
        signature: { type: String },
    },
    bookedAt: {
        type: Date,
        default: Date.now
    },
    travelDate: {
        type: Date,
        required: true
    },
}, { timestamps: true });

export const BookingModel = model<IBookingDocument>("Booking", BookingSchema);
