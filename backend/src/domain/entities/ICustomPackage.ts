import { Types } from 'mongoose';
import {
  TripTypeEnum,
  AccommodationTypeEnum,
  CustomPkgStatusEnum,
} from '@constants/enum/customPackageEnum';

export interface ICustomPackage {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  startingPoint:string;
  tripType: TripTypeEnum;
  otherTripType?: string; // if tripType is "other"
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: AccommodationTypeEnum;
  additionalDetails?: string; // for custom requirements
  status: CustomPkgStatusEnum;
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
