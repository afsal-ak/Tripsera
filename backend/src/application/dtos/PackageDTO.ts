import { Types } from "mongoose";
import { IPackage, IOffer, ImageInfo, ItineraryDay, ILocation } from "@domain/entities/IPackage";
export interface CreatePackageDTO {
  title: string;
  description: string;
  price: number;
  

  // Duration
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

  included: string[];
  notIncluded: string[];

  // Itinerary
  itinerary: ItineraryDay[];

  // Images
  imageUrls?: ImageInfo[];

  // Offer
  offer?: IOffer;

  // Other info
  importantDetails?: string;
  isBlocked: boolean;
}


export interface EditPackageDTO {
  // Basic info
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  durationDays?: number;
  durationNights?: number;

  // Dates
  startDate?: Date;
  endDate?: Date;

  // Relations
  category?: Types.ObjectId[];
  startPoint?: string;
  location?: ILocation[];

  included?: string[];
  notIncluded?: string[];

  // Itinerary
  itinerary?: ItineraryDay[];

  // Images
  images?: File[];
  existingImages?: ImageInfo[];
  // Offer
  offer?: IOffer;

  // Other info
  importantDetails?: string;
  isBlocked?: boolean;
}
export interface UpdatePackageStatusDTO {
  pkgId: string;
  isBlocked: boolean;
}


export interface PackageResponseDTO {
  id: string;
  title: string;
  description: string;
  price: number;           // will be discounted price
  finalPrice: number;   // the actual price in DB
  duration: string;
  durationDays: number;
  durationNights: number;

  startDate?: Date;
  endDate?: Date;

  category: Types.ObjectId[];
  location: ILocation[];
  startPoint: string;

  included: string[];
  notIncluded: string[];

  itinerary: ItineraryDay[];

  images?: string[]; // optional URLs of newly uploaded images
  imageUrls: ImageInfo[];

  offer?: IOffer;

  importantDetails?: string;
  isBlocked: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

// ---------------- MAPPER FUNCTION ----------------
export const toPackageResponseDTO = (pkg: IPackage): PackageResponseDTO => {

  let finalPrice = pkg.price;
  if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > new Date()) {
    if (pkg.offer.type === "percentage") {
      finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
    } else if (pkg.offer.type === "flat") {
      finalPrice = pkg.price - pkg.offer.value;
    }
    finalPrice = Math.max(finalPrice, 0);
  }

  return {
    id: pkg._id?.toString() || "",
    title: pkg.title,
    description: pkg.description,
    price: pkg.price,
    finalPrice: finalPrice,
    duration: pkg.duration,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    startDate: pkg.startDate,
    endDate: pkg.endDate,
    category: pkg.category,
    location: pkg.location,
    startPoint: pkg.startPoint,
    included: pkg.included,
    notIncluded: pkg.notIncluded,
    itinerary: pkg.itinerary,
    images: pkg.images?.map((f) => (f instanceof File ? URL.createObjectURL(f) : undefined)).filter(Boolean) as string[],
    imageUrls: pkg.imageUrls || [],
    offer: pkg.offer,
    importantDetails: pkg.importantDetails,
    isBlocked: pkg.isBlocked,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
  };
};
