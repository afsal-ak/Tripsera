import mongoose, { Schema, Document } from "mongoose";
import { ICustomPackage } from "@domain/entities/ICustomPackage";

 type CustomPackageDocument = ICustomPackage & Document;

const CustomPackageSchema = new Schema<CustomPackageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    destination: { type: String, required: true },
    tripType: {
      type: String,
      enum: ["romantic", "adventure", "family", "luxury", "budget", "other"],
      required: true,
    },
    otherTripType: { type: String }, // filled if tripType = other
    budget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, default: 0 },
    accommodation: {
      type: String,
      enum: ["luxury", "standard", "budget"],
      required: true,
    },
    additionalDetails: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "inProgress", "completed", "cancelled"],
      default: "pending",
    },
    adminResponse: { type: String },
  },
  { timestamps: true }
);

const CustomPackage = mongoose.model<CustomPackageDocument>(
  "CustomPackage",
  CustomPackageSchema
);

export default CustomPackage;
