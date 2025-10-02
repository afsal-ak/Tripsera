
 
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
  name:string,
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

  title: string;
  description: string;
  price: number;
finalPrice:number;
  duration?: string; 
  durationDays?: number;
  durationNights?: number;

  startDate?: string;
  endDate?: string;

  category: string[];
  location: ILocation[];
  startPoint: string;

  included: string[];
  notIncluded: string[];

  itinerary: ItineraryDay[];

  images?: File[];         // new uploads
  imageUrls?: ImageInfo[]; // existing images

  offer?: IOffer;

  importantDetails?: string;
  isBlocked: boolean;

  createdAt?: string;
  updatedAt?: string;
}


// // export interface GeoPoint {
// //   type: 'Point';
// //   coordinates: [number, number]; // [lng, lat]
// // }

// // export interface ILocation {
// //   name: string;
// //   geo: GeoPoint;
// // }

// // export type OfferType = 'percentage' | 'flat';

// // export interface IOffer {
// //   type: OfferType;
// //   value: number;
// //   validUntil: Date;
// //   isActive: boolean;
// // }

// // export interface ImageInfo {
// //   url: string;
// //   public_id: string;
// // }

// // export interface ItineraryDay {
// //   day: number;
// //   title: string;
// //   activities: string[];
// // }

// // export interface IPackage {
// //   _id: string;
// //   title: string;
// //   description?: string;
// //   price: number;
// //   duration: string;
// //   durationDays?: string;
// //   durationNights?: string;
// //   imageUrls: { url: string }[];
// //   category?: { _id: string; name: string }[];
// //   location?: ILocation[];
// //   offer?: IOffer;
// //   isBlocked: boolean;
// //   startDate?: Date;
// //   endDate?: Date;
// //   itinerary?: ItineraryDay[];
// //   importantDetails?: string;
// //   included?: string[];
// //   notIncluded?: string[];
// //   createdAt?: Date;
// //   updatedAt?: Date;
// // }


// // Geo location of a place
// export interface GeoPoint {
//   type: "Point";
//   coordinates: [number, number]; // [lng, lat]
// }

// export interface ILocation {
//   name: string;
//   geo: GeoPoint;
// }

// // Offer section
// export type OfferType = "percentage" | "flat";

// export interface IOffer {
//   type: OfferType;
//   value: number;
//   validUntil: string; // keep as string for forms (convert to Date in backend)
//   isActive: boolean;
// }

// // Image info (for cloud storage like Cloudinary/S3)
// export interface ImageInfo {
//   url: string;
//   public_id: string;
// }

// // Each itinerary day
// export interface ItineraryDay {
//   day: number;
//   title: string;
//   activities: string[];
// }

// // Main package interface
// export interface IPackage {
//   _id?: string;

//   // Basic info
//   title: string;
//   description: string;
//   price: number;

//   // Duration
//   duration: string; // e.g. "5D/4N"
//   durationDays: number;
//   durationNights: number;

//   // Dates
//   startDate: string; // ISO string for frontend
//   endDate: string;

//   // Relations
//   category: { _id: string; name: string }[]; // populated list from backend
//   location: ILocation[];
//   startPoint: string;

//   // Inclusions & Exclusions
//   included: string[];
//   notIncluded: string[];

//   // Itinerary
//   itinerary: ItineraryDay[];

//   // Images
//   images?: File[]; // for form uploads
//   imageUrls: ImageInfo[]; // after upload

//   // Offer
//   offer?: IOffer;

//   // Other info
//   importantDetails?: string;
//   isBlocked: boolean;

//   // Timestamps
//   createdAt?: Date;
//   updatedAt?: Date;
// }
