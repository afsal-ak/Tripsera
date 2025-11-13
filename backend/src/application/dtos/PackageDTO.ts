import { Types } from 'mongoose';
import { EnumOfferType, EnumPackageType } from '@constants/enum/packageEnum';

// Location DTO
export interface GeoPointDTO {
  type: 'Point';
  coordinates: [number, number];
}

export interface LocationDTO {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  mapZoomLevel?: number;
  geo: GeoPointDTO;
}

// Offer DTO
export interface OfferDTO {
  name: string;
  type: EnumOfferType;
  value: number;
  validUntil: string;
  isActive: boolean;
}

// Image DTO
export interface ImageInfoDTO {
  url: string;
  public_id: string;
  existing?: boolean;
}

// Itinerary & Activity DTOs
export interface ActivityDTO {
  startTime: string; // keep required (matches entity)
  endTime: string;
  activity: string;
}

export interface ItineraryDayDTO {
  day: number;
  title: string;
  description?: string;
  activities: ActivityDTO[];
}

// Create Package DTO
export interface CreatePackageDTO {
  title: string;
  description: string;
  price: number;
  pricePerChild?: number;
  ageOfAdult: number;
  ageOfChild?: number;
  durationDays: number;
  durationNights: number;
  startDate?: Date;
  endDate?: Date;
  category: Types.ObjectId[];
  location: LocationDTO[];
  startPoint: string;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDayDTO[];
  imageUrls?: ImageInfoDTO[];
  offer?: OfferDTO;

  packageType: EnumPackageType;
  departureDates?: Date;
  groupSize?: number;
  availableSlots?: number;
  importantDetails?: string;
  isBlocked: boolean;
}

// Edit Package DTO
export interface EditPackageDTO extends Partial<CreatePackageDTO> {
  images?: File[];
  existingImages?: ImageInfoDTO[];
}

// Response DTO
export interface PackageResponseDTO {
  _id: string;
  title: string;
  description: string;
  price: number;
  pricePerChild?: number;
  ageOfAdult?: number;
  ageOfChild?: number;
  finalPrice: number;
  durationDays: number;
  durationNights: number;
  startDate?: Date;
  endDate?: Date;
  departureDates?: Date;
  groupSize?: number;
  availableSlots?: number;
  category: Types.ObjectId[];
  location: LocationDTO[];
  startPoint: string;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDayDTO[];
  imageUrls: ImageInfoDTO[];
  offer?: OfferDTO;
  importantDetails?: string;
  isCustom?: boolean;
  packageType: EnumPackageType;
  customReqId?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PackageTableResponseDTO {
  _id: string;
  title: string;
  price: number;
  pricePerChild: number;
  ageOfAdult: number;
  ageOfChild: number;
  finalPrice: number;
  category: Types.ObjectId[];
  durationDays?: number;
  durationNights?: number;
  isBlocked: boolean;
  offerName?: string;
  packageType: EnumPackageType;
  departureDates?: Date;
  endDate?:Date;
  availableSlots?: number;

  // isCustom?: boolean;
  createdFor?: string;
  customReqId?: string;
  categoryCount: number;
  createdAt?: Date;
}

export interface PackageCardDTO {
  _id: string;
  title: string;
  categoryNames: string[];
  durationDays: number;
  durationNights: number;
  price: number;
  finalPrice: number;
  availableSlots?: number;
  imageUrl: string | null;
  offerName?: string;
  offerType?: string;
  offerValue?: number;
  packageType: EnumPackageType;


}
