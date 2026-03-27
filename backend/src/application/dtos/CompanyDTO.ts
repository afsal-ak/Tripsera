export interface CreateCompanyDTO {
  name: string
  email: string
  phone: number
  description?: string
  website?: string

  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }

  gstNumber?: string
  licenseNumber?: string
}


export interface UpdateCompanyDTO {
  name?: string;
  phone?: number;
  email?:string;
  description?: string;
  website?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}
export interface CompanyResponseDTO {
  id: string
  name: string
  email: string
  phone: number
  ownerId: string,
  isSetupComplete?:boolean
}
export interface CompanyFullResponseDTO {
  id: string
  name: string
  email: string
  phone: number

  ownerId: string

  description?: string
  website?: string

  logo?: {
    url: string
    public_id: string
  }

  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }

  gstNumber?: string
  licenseNumber?: string

  documents?: {
    gstCertificate?: {
      url: string
      public_id: string
    }

    businessLicense?: {
      url: string
      public_id: string
    }
  }

  rating?: number
  totalReviews?: number

  isApproved?: boolean
  isBlocked?: boolean
  isSetupComplete?: boolean

  createdAt?: Date
  updatedAt?: Date
}
// export interface CreateCompanyDTO {
//   name: string;
//   email: string;
//   phone: string;
//   description?: string;
//   website?: string;

//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     postalCode?: string;
//   };

//   gstNumber?: string;
//   licenseNumber?: string;
// }