// // import { Types } from "mongoose";
// // import { IPackage, IOffer, ImageInfo, ItineraryDay, ILocation } from "@domain/entities/IPackage";
// // export interface CreatePackageDTO {
// //   title: string;
// //   description: string;
// //   price: number;
  

// //   // Duration
// //   duration: string;
// //   durationDays: number;
// //   durationNights: number;

// //   // Dates
// //   startDate?: Date;
// //   endDate?: Date;

// //   // Relations
// //   category: Types.ObjectId[];
// //   location: ILocation[];
// //   startPoint: string;

// //   included: string[];
// //   notIncluded: string[];

// //   // Itinerary
// //   itinerary: ItineraryDay[];

// //   // Images
// //   imageUrls?: ImageInfo[];

// //   // Offer
// //   offer?: IOffer;

// //   // Other info
// //   importantDetails?: string;
// //   isBlocked: boolean;
// // }


// // export interface EditPackageDTO {
// //   // Basic info
// //   title?: string;
// //   description?: string;
// //   price?: number;
// //   duration?: string;
// //   durationDays?: number;
// //   durationNights?: number;

// //   // Dates
// //   startDate?: Date;
// //   endDate?: Date;

// //   // Relations
// //   category?: Types.ObjectId[];
// //   startPoint?: string;
// //   location?: ILocation[];

// //   included?: string[];
// //   notIncluded?: string[];

// //   // Itinerary
// //   itinerary?: ItineraryDay[];

// //   // Images
// //   images?: File[];
// //   existingImages?: ImageInfo[];
// //   // Offer
// //   offer?: IOffer;

// //   // Other info
// //   importantDetails?: string;
// //   isBlocked?: boolean;
// // }
// // export interface UpdatePackageStatusDTO {
// //   pkgId: string;
// //   isBlocked: boolean;
// // }


// // export interface PackageResponseDTO {
// //   id: string;
// //   title: string;
// //   description: string;
// //   price: number;           // will be discounted price
// //   finalPrice: number;   // the actual price in DB
// //   duration: string;
// //   durationDays: number;
// //   durationNights: number;

// //   startDate?: Date;
// //   endDate?: Date;

// //   category: Types.ObjectId[];
// //   location: ILocation[];
// //   startPoint: string;

// //   included: string[];
// //   notIncluded: string[];

// //   itinerary: ItineraryDay[];

// //   images?: string[]; // optional URLs of newly uploaded images
// //   imageUrls: ImageInfo[];

// //   offer?: IOffer;

// //   importantDetails?: string;
// //   isBlocked: boolean;

// //   createdAt?: Date;
// //   updatedAt?: Date;
// // }

// //  export const toPackageResponseDTO = (pkg: IPackage): PackageResponseDTO => {

// //   let finalPrice = pkg.price;
// //   if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > new Date()) {
// //     if (pkg.offer.type === "percentage") {
// //       finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
// //     } else if (pkg.offer.type === "flat") {
// //       finalPrice = pkg.price - pkg.offer.value;
// //     }
// //     finalPrice = Math.max(finalPrice, 0);
// //   }

// //   return {
// //     id: pkg._id?.toString() || "",
// //     title: pkg.title,
// //     description: pkg.description,
// //     price: pkg.price,
// //     finalPrice: finalPrice,
// //     duration: pkg.duration,
// //     durationDays: pkg.durationDays,
// //     durationNights: pkg.durationNights,
// //     startDate: pkg.startDate,
// //     endDate: pkg.endDate,
// //     category: pkg.category,
// //     location: pkg.location,
// //     startPoint: pkg.startPoint,
// //     included: pkg.included,
// //     notIncluded: pkg.notIncluded,
// //     itinerary: pkg.itinerary,
// //     images: pkg.images?.map((f) => (f instanceof File ? URL.createObjectURL(f) : undefined)).filter(Boolean) as string[],
// //     imageUrls: pkg.imageUrls || [],
// //     offer: pkg.offer,
// //     importantDetails: pkg.importantDetails,
// //     isBlocked: pkg.isBlocked,
// //     createdAt: pkg.createdAt,
// //     updatedAt: pkg.updatedAt,
// //   };
// // };
// import { Types } from 'mongoose';
// import { EnumOfferType } from '@constants/enum/packageEnum';


// export interface CreatePackageDTO {
//   title: string;
//   description: string;
//   price: number;
  

//   // Duration
//   duration: string;
//   durationDays: number;
//   durationNights: number;

//   // Dates
//   startDate?: Date;
//   endDate?: Date;

//   // Relations
//   category: Types.ObjectId[];
//   location: ILocation[];
//   startPoint: string;

//   included: string[];
//   notIncluded: string[];

//   // Itinerary
//   itinerary: ItineraryDay[];

//   // Images
//   imageUrls?: ImageInfo[];

//   // Offer
//   offer?: IOffer;

//   // Other info
//   importantDetails?: string;
//   isBlocked: boolean;
// }


// export interface EditPackageDTO {
//   // Basic info
//   title?: string;
//   description?: string;
//   price?: number;
//   duration?: string;
//   durationDays?: number;
//   durationNights?: number;

//   // Dates
//   startDate?: Date;
//   endDate?: Date;

//   // Relations
//   category?: Types.ObjectId[];
//   startPoint?: string;
//   location?: ILocation[];

//   included?: string[];
//   notIncluded?: string[];

//   // Itinerary
//   itinerary?: ItineraryDay[];

//   // Images
//   images?: File[];
//   existingImages?: ImageInfo[];
//   // Offer
//   offer?: IOffer;

//   // Other info
//   importantDetails?: string;
//   isBlocked?: boolean;
// }
// export interface UpdatePackageStatusDTO {
//   pkgId: string;
//   isBlocked: boolean;
// }


// export interface ImageInfoDTO {
//   url: string;
//   public_id: string;
// }

// export interface LocationDTO {
//   name: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   mapZoomLevel?: number;
//   geo: {
//     type: 'Point';
//     coordinates: [number, number];
//   };
// }

// export interface OfferDTO {
//   name: string;
//   type: EnumOfferType;
//   value: number;
//   validUntil: string;
//   isActive: boolean;
// }

// export interface ItineraryActivityDTO {
//   activity: string;
//   startTime?: string;
//   endTime?: string;
// }

// export interface ItineraryDayDTO {
//   day: number;
//   title: string;
//   description?: string;
//   activities: ItineraryActivityDTO[];
// }

// export interface PackageResponseDTO {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   finalPrice: number;
//   duration: string;
//   durationDays: number;
//   durationNights: number;
//   startDate?: Date;
//   endDate?: Date;
//   category: Types.ObjectId[];
//   location: LocationDTO[];
//   startPoint: string;
//   included: string[];
//   notIncluded: string[];
//   itinerary: ItineraryDayDTO[];
//   imageUrls: ImageInfoDTO[];
//   offer?: OfferDTO;
//   importantDetails?: string;
//   isBlocked: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// /**
//  * For admin table / list display (lighter)
//  */
// export interface PackageTableResponseDTO {
//   id: string;
//   title: string;
//   price: number;
//   finalPrice: number;
//   duration: string;
//   isBlocked: boolean;
//   offerName?: string;
//   categoryCount: number;
//   locationCount: number;
//   createdAt?: Date;
// }


// import { Types } from 'mongoose';
// import { EnumOfferType } from '@constants/enum/packageEnum';

// export interface GeoPointDTO {
//   type: 'Point';
//   coordinates: [number, number]; // [longitude, latitude]
// }

// export interface LocationDTO {
//   name: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   mapZoomLevel?: number;
//   geo: GeoPointDTO;
// }

// export interface OfferDTO {
//   name: string;
//   type: EnumOfferType;
//   value: number;
//   validUntil: string;
//   isActive: boolean;
// }

// // export interface ActivityDTO {
// //   startTime?: string;
// //   endTime?: string;
// //   activity: string;
// // }
// export interface ActivityDTO {
//   name: string;
//   startTime: string;
//   endTime: string;
//   description: string;
// }

// export interface ItineraryDayDTO {
//   day: number;
//   title: string;
//   description?: string;
//   activities: ActivityDTO[];
// }

// export interface ImageInfoDTO {
//   url: string;
//   public_id: string;
//   existing?: boolean;
// }

// /**
//  * ---------------- Create / Edit / Update DTOs ----------------
//  */
// export interface CreatePackageDTO {
//   title: string;
//   description: string;
//   price: number;
//   duration: string;
//   durationDays: number;
//   durationNights: number;
//   startDate?: Date;
//   endDate?: Date;
//   category: Types.ObjectId[];
//   location: LocationDTO[];
//   startPoint: string;
//   included: string[];
//   notIncluded: string[];
//   itinerary: ItineraryDayDTO[];
//   imageUrls?: ImageInfoDTO[];
//   offer?: OfferDTO;
//   importantDetails?: string;
//   isBlocked: boolean;
// }

// export interface EditPackageDTO extends Partial<CreatePackageDTO> {
//   images?: File[];
//   existingImages?: ImageInfoDTO[];
// }

// export interface UpdatePackageStatusDTO {
//   pkgId: string;
//   isBlocked: boolean;
// }
 
// export interface PackageResponseDTO {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   finalPrice: number;
//   duration: string;
//   durationDays: number;
//   durationNights: number;
//   startDate?: Date;
//   endDate?: Date;
//   category: Types.ObjectId[];
//   location: LocationDTO[];
//   startPoint: string;
//   included: string[];
//   notIncluded: string[];
//   itinerary: ItineraryDayDTO[];
//   imageUrls: ImageInfoDTO[];
//   offer?: OfferDTO;
//   importantDetails?: string;
//   isBlocked: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface PackageTableResponseDTO {
//   id: string;
//   title: string;
//   price: number;
//   finalPrice: number;
//   duration: string;
//   isBlocked: boolean;
//   offerName?: string;
//   categoryCount: number;
//   locationCount: number;
//   createdAt?: Date;
// }
// 📦 src/application/dtos/PackageDTO.ts
import { Types } from "mongoose";
import { EnumOfferType } from "@constants/enum/packageEnum";

// Location DTO
export interface GeoPointDTO {
  type: "Point";
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
  duration: string;
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
  finalPrice: number;
  duration: string;
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
  imageUrls: ImageInfoDTO[];
  offer?: OfferDTO;
  importantDetails?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PackageTableResponseDTO {
  _id: string;
  title: string;
  price: number;
  finalPrice: number;
  duration: string;
    category: Types.ObjectId[];

  isBlocked: boolean;
  offerName?: string;
  categoryCount: number;
  locationCount: number;
  createdAt?: Date;
}
