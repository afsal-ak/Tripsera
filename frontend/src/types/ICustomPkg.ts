export interface ICustomPackage {
  id: string;
  userId: {
    username?: string;
    email?: string;
    profileImage?: { url: string };
  };

  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  startingPoint?: string;

  tripType: 'romantic' | 'adventure' | 'family' | 'luxury' | 'budget' | 'other';
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: 'luxury' | 'standard' | 'budget';
  additionalDetails?: string;
  status: 'pending' | 'approved' | 'rejected' | 'inProgress' | 'completed' | 'cancelled';
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ICustomAdminPackage {
  id: string;
  userId: string;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  destination: string;
  startingPoint: string;

  tripType: 'romantic' | 'adventure' | 'family' | 'luxury' | 'budget' | 'other';
  otherTripType?: string;
  budget: number;
  startDate: Date;
  days: number;
  nights: number;
  adults: number;
  children?: number;
  accommodation: 'luxury' | 'standard' | 'budget';
  additionalDetails?: string;
  status: 'pending' | 'approved' | 'rejected' | 'inProgress' | 'completed' | 'cancelled';
  adminResponse?: string;
  createdAt?: Date;
  updatedAt?: Date;
}




export interface OfferDTO {
  discountType: 'percentage' | 'flat';
  discountValue: number;
  validUntil: Date;
}

export interface UserInfoDTO {
  _id: string;
  username: string;
  email: string;
  profileImage?: {url:string | null};
}

export interface CustomRequestInfoDTO {
  _id: string;
  packageName: string;
  destination?: string;
  budget?: number;
}

export interface CustomPackageApprovedResponseDTO {
  _id: string;
  title: string;
  description: string;
  price: number;
  offer?: OfferDTO;

  isBlocked: boolean;
  isCustom: boolean;
  createdAt: Date;

  userDetails?: UserInfoDTO;
  customRequest?: CustomRequestInfoDTO;
 }