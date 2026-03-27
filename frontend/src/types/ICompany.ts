

export interface ICompany {
  _id?: string;

  name: string;
  email: string;
  phone: string;

  //   ownerId: string;
  ownerId: string;

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
  isSetupComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}