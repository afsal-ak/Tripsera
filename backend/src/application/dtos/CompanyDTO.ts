export interface CreateCompanyDTO {
  name: string;
  email: string;
  phone: string;
  description?: string;
  website?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  gstNumber?: string;
  licenseNumber?: string;
}