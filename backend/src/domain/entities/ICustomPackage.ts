import { Types } from "mongoose";

export interface ICustomPackage {
   _id?: Types.ObjectId | string;
  userId?: Types.ObjectId|string;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  tripType: "romantic" | "adventure" | "family" | "luxury" | "budget" | "other";
  otherTripType?: string; // if tripType is "other"
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: "luxury" | "standard" | "budget";
  additionalDetails?: string; // for custom requirements
  status: "pending" | "approved" | "rejected" | "inProgress" | "completed" | "cancelled";
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
