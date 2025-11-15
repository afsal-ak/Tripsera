export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

// export interface ILocation {
//   name: string;
//   geo: GeoPoint;
// }

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

export type OfferType = 'percentage' | 'flat';

export interface IOffer {
  name: string;
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

export interface ICategory {
  _id: string;
  name: string;
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
  finalPrice: number;
  duration?: string;
  durationDays?: number;
  durationNights?: number;
  packageType: string;
  ageOfAdult: number;
  ageOfChild?: number;
  pricePerChild?: number;

  startDate?: string;
  endDate?: string;
  departureDates?: Date;
  groupSize?: number;
  availableSlots?: number;
  category: ICategory[];
  location: ILocation[];
  startPoint: string;

  included: string[];
  notIncluded: string[];

  itinerary: ItineraryDay[];

  images?: File[]; // new uploads
  imageUrls?: ImageInfo[]; // existing images
imageUrl: string;
  offer?: IOffer;

  importantDetails?: string;
  isBlocked: boolean;
  isCustom?: boolean;
  createdFor: string;
  createdAt?: string;
  updatedAt?: string;
}
