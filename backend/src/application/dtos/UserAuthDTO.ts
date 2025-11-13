import { EnumUserRole } from '@constants/enum/userEnum';
import { IUser } from '@domain/entities/IUser';

export interface PreRegistrationDTO {
  email: string;
  username: string;
  password: string;
  referredReferralCode?: string;
}

export interface ForgotPasswordChangeDTO {
  email: string;
  password: string;
  otp?: string;
}

export interface LoginResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: EnumUserRole;
  fullName?: string;
  phone?: number;
  profileImage?: { url: string; public_id: string };
  isGoogleUser: boolean;
  isNewsletterSubscribed: boolean;
}
