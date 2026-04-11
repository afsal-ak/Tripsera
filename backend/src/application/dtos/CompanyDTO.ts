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
  email?: string;
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
  _id: string
  name: string
  email: string
  phone: number
  ownerId: string,
  isApproved?: boolean
  isBlocked?: boolean
  isSetupComplete?: boolean
}


export interface CompanyFullResponseDTO {
  _id: string
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



export interface ICompanyFilterDTO {
  search?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  page?: number;
  limit?: number;
}

export interface ICompanyListResponseDTO {
  companies: CompanyFullResponseDTO[];
  total: number;
  page: number;
  totalPages: number;
}