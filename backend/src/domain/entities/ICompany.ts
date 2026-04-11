import { Types } from 'mongoose';


export interface ICompany {
  // _id?: string;
  _id?: Types.ObjectId | string;

  name: string;
  email: string;
  phone: number;

//   ownerId: string;
  ownerId: Types.ObjectId | string;

  description?: string;
  website?: string;

  logo?: {
    url: string;
    public_id: string;
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  gstNumber?: string;
  licenseNumber?: string;

  documents?: {
    gstCertificate?: {
      url: string;
      public_id: string;
    };
    businessLicense?: {
      url: string;
      public_id: string;
    };
  };

  rating?: number;
  totalReviews?: number;

  isApproved?: boolean;
  isBlocked?: boolean;
  isSetupComplete:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}