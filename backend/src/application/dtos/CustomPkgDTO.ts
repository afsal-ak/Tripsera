import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { Types } from "mongoose";

export interface CreateCustomPkgDTO {
  userId?: Types.ObjectId;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  tripType: "romantic" | "adventure" | "family" | "luxury" | "budget" | "other";
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: "luxury" | "standard" | "budget";
  additionalDetails?: string;
}
export interface UpdateCustomPkgDTO {
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination?: string;
  tripType?: "romantic" | "adventure" | "family" | "luxury" | "budget" | "other";
  otherTripType?: string;
  budget?: number;
  startDate?: Date;
  days?: number;
  nights?: number;
  adults?: number;
  children?: number;
  accommodation?: "luxury" | "standard" | "budget";
  additionalDetails?: string;
  status?: "pending" | "approved" | "rejected" | "inProgress" | "completed" | "cancelled";
  adminResponse?: string;
}

export interface UpdateCustomPkgStatusDTO {
  pkgId: string;
  status?: "pending" | "approved" | "rejected" | "inProgress" | "completed" | "cancelled";
  adminResponse?: string;
}


export interface CustomPkgResponseDTO {
  id: string;
  userId?: string;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  tripType: string;
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: string;
  additionalDetails?: string;
  status: string;
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const toCustomPkgResponseDTO = (customPkg: ICustomPackage): CustomPkgResponseDTO => {
  return {
    id: customPkg._id?.toString?.() || "",
    userId: customPkg?.userId as string,
    guestInfo: customPkg.guestInfo,
    destination: customPkg.destination,
    tripType: customPkg.tripType,
    otherTripType: customPkg.otherTripType,
    budget: customPkg.budget,
    startDate: customPkg.startDate,
    days: customPkg.days,
    nights: customPkg.nights,
    adults: customPkg.adults,
    children: customPkg.children,
    accommodation: customPkg.accommodation,
    additionalDetails: customPkg.additionalDetails,
    status: customPkg.status,
    adminResponse: customPkg.adminResponse,
    createdAt: customPkg.createdAt,
    updatedAt: customPkg.updatedAt,
  };
};
