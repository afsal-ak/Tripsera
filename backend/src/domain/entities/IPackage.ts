import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';
import { Types } from 'mongoose';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ILocation {
  name: string; // e.g., "Calangute Beach"
  address?: string; // optional
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  mapZoomLevel?: number; // optional map zoom level
  geo: GeoPoint; // location coordinates
}


export interface IOffer {
  name: string;
  type: EnumOfferType;
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
  
  ageOfAdult:number;
  ageOfChild?:number;
  // Basic info
  packageCode:string;
  title: string;
  description: string;
  finalPrice?: number;
  price: number; // base price
  pricePerChild?:number;
  originalPrice?: number;
  duration?: string;
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

  //for custom package
  packageType: EnumPackageType;
  departureDates?: Date;
  groupSize?: number;
  availableSlots?: number;

   createdFor?: Types.ObjectId;
  customReqId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}


// import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';
// import { Types } from 'mongoose';

// export interface GeoPoint {
//   type: 'Point';
//   coordinates: [number, number]; // [longitude, latitude]
// }

// export interface ILocation {
//   name: string; // e.g., "Calangute Beach"
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   mapZoomLevel?: number;
//   geo: GeoPoint;
// }

// export interface IOffer {
//   name: string;
//   type: EnumOfferType;
//   value: number;
//   validUntil: string;
//   isActive: boolean;
// }

// export interface ImageInfo {
//   url: string;
//   public_id: string;
//   existing?: boolean;
// }

// export interface Activity {
//   startTime: string;
//   endTime: string;
//   activity: string;
// }

// export interface ItineraryDay {
//   day: number;
//   title: string;
//   description?: string;
//   activities: Activity[];
// }

// export interface IAddon {
//   name: string;
//   price: number;
//   description?: string;
// }

// export interface IDepartureVariant {
//   startPoint: string;
//   priceAdult: number;
//   priceChild: number;
//   availableSlots: number;
//   groupSize?: number;
//   departureDates?: Date[];
// }

// export interface IAgeGroup {
//   adultMinAge: number;
//   childMaxAge: number;
// }

// export interface IAccommodationDetail {
//   hotelName: string;
//   location?: string;
//   roomType?: string;
//   rating?: number; // e.g., 3, 4, 5 stars
//   amenities?: string[];
//   description?: string;
//   images?: ImageInfo[];
// }

// export interface IPolicy {
//   cancellationPolicy?: string;
//   refundPolicy?: string;
//   termsAndConditions?: string;
//   importantNotes?: string;
// }

// export interface IPackage {
//   _id?: string;

//   // Basic Info
//   packageCode: string;
//   slug?: string; // for SEO-friendly URLs
//   title: string;
//   description: string;

//   // Pricing
//   price: number;
//   childPrice?: number;
//   finalPrice?: number;
//   originalPrice?: number;
//   duration?: string;
//   durationDays: number;
//   durationNights: number;

//   // Dates
//   startDate?: Date;
//   endDate?: Date;

//   // Relations
//   category: Types.ObjectId[];
//   location: ILocation[];
//   startPoint: string;

//   // Inclusions & Exclusions
//   included: string[];
//   notIncluded: string[];

//   // Itinerary
//   itinerary: ItineraryDay[];

//   // Images
//   images?: File[];
//   imageUrls?: ImageInfo[];

//   // Offer
//   offer?: IOffer;

//   // Add-ons
//   addons?: IAddon[];

  
//    ageGroup?: IAgeGroup;

//   // Accommodation
//   accommodationDetails?: IAccommodationDetail[];

//   // Policies
//   policies?: IPolicy;

//   // Other Info
//   importantDetails?: string;
//   isBlocked: boolean;

//   // Package type
//   packageType?: EnumPackageType;

//   // Group Travel Info
//   departureDates?: Date[];
//   groupSize?: number;
//   availableSlots?: number;

//   // Custom Package Info
//   createdFor?: Types.ObjectId;
//   customReqId?: Types.ObjectId;

//   createdAt?: Date;
//   updatedAt?: Date;
// }
