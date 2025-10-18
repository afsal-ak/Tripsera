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
