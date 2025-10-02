
import { Types } from 'mongoose';

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface ILocation {
  name: string;
  geo: GeoPoint;
}

export type OfferType = "percentage" | "flat";

export interface IOffer {
  name: string,
  type: OfferType;
  value: number;
  validUntil: string;
  isActive: boolean;
}

export interface ImageInfo {
  url: string;
  public_id: string;
  existing?: boolean;

}

export interface Activity {
  startTime: string;
  endTime: string;
  activity: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  activities: Activity[]; // timeline activities
}

export interface IPackage {
  _id?: string;

  // Basic info
  title: string;
  description: string;
  finalPrice?: number;
  price: number;  // base price  
  originalPrice?: number;
  duration: string;
  durationDays: number;
  durationNights: number;

  // Dates
  startDate?: Date;
  endDate?: Date;

  // Relations
  category: Types.ObjectId[];
  location: ILocation[];
  startPoint: string;

  // Inclusions & Exclusions
  included: string[];
  notIncluded: string[];

  // Itinerary
  itinerary: ItineraryDay[];

  // Images
  images?: File[];
  imageUrls?: ImageInfo[];

  // Offer
  offer?: IOffer;

  // Other info
  importantDetails?: string;
  isBlocked: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
