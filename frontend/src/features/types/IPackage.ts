

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
  type: OfferType;
  value: number;
  validUntil: Date;
  isActive: boolean;
}

export interface ImageInfo {
  url: string;
  public_id: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface IPackage {
  _id:string;
  title: string;
  description?: string;
  price: number;
  duration: string;
   imageUrls: { url: string }[];
  category?: { _id: string; name: string }[];  
  location?: ILocation[];
  offer?: IOffer;
  isBlocked: boolean;
  startDate?: Date;
  endDate?: Date;
  itinerary?: ItineraryDay[];
  importantDetails?: string;
  included?: string[];
  notIncluded?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
