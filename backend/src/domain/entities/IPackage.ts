// export interface Coordinates {
//   lat: number;
//   lng: number;
// }

// export interface Location {
//   name: string;
//   coordinates: Coordinates;
// }


// export interface Offer {
//   discountPercentage: number;
//   validUntil: Date;
//   isActive: boolean;
// }



// export interface IPackage  {
//   id?: string;
//   title: string;
//   description?: string;
//   location: Location[];
//   price: number;
//   duration: string;
//   imageUrls: string[];
//   category: string[];
//   offer?: Offer;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
import { Types } from "mongoose";

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
export interface IPackage {
  title: string;
  description?: string;
  price: number;
  duration: string;
  imageUrls?: ImageInfo[];
  category?: Types.ObjectId[];
  location?: ILocation[];
  offer?: IOffer;
  isBlocked:boolean,
  createdAt?: Date;
  updatedAt?: Date;
}
