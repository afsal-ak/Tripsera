import { TripTypeEnum, AccommodationTypeEnum, CustomPkgStatusEnum } from "@constants/enum/customPackageEnum";
 import { Types } from "mongoose";
import { ICustomPackage } from "@domain/entities/ICustomPackage";

export interface CreateCustomPkgDTO {
  userId?: Types.ObjectId;
  guestInfo?: { name?: string; email?: string; phone?: string };
  destination: string;
  tripType: TripTypeEnum;
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: AccommodationTypeEnum;
  additionalDetails?: string;
}

export interface UpdateCustomPkgDTO {
  guestInfo?: { name?: string; email?: string; phone?: string };
  destination?: string;
  tripType?: TripTypeEnum;
  otherTripType?: string;
  budget?: number;
  startDate?: Date;
  days?: number;
  nights?: number;
  adults?: number;
  children?: number;
  accommodation?: AccommodationTypeEnum;
  additionalDetails?: string;
  status?: CustomPkgStatusEnum;
  adminResponse?: string;
}

export interface UpdateCustomPkgStatusDTO {
  pkgId: string;
  status?: CustomPkgStatusEnum;
  adminResponse?: string;
}


export interface CustomPkgTableDTO {
  id: string;
  userId?: string;
  destination: string;
  tripType: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  status: string;
}

export interface CustomPkgUserListDTO {
  id: string;
  destination: string;
  tripType: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  status: string;
  createdAt: Date;
}

export interface CustomPkgResponseDTO {
  id: string;
  userId?: string;
  guestInfo?: { name?: string; email?: string; phone?: string };
  destination: string;
  tripType: TripTypeEnum | string;
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: AccommodationTypeEnum | string;
  additionalDetails?: string;
  status: CustomPkgStatusEnum | string;
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
