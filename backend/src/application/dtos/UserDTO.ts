import { EnumUserRole, EnumGender } from '@constants/enum/userEnum';

export interface UserDetailsResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: EnumUserRole;
  isBlocked: boolean;
  fullName?: string;
  phone?: number;
  dob?: Date;
  gender?: EnumGender;
  profileImage?: { url: string; public_id: string };
  coverImage?: { url: string; public_id: string };
  bio?: string;
  links?: { platform: string; url: string }[];
  followersCount: number;
  followingCount: number;
  interests?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  referralCode?: string;
  referredBy?: string;
  isGoogleUser?: boolean;
}

export interface UserBasicResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: EnumUserRole;
  fullName?: string;
  profileImage?: { url: string; public_id: string };
  gender?: EnumGender;
  isBlocked: boolean;
}
export interface AdminUserListResponseDTO {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  role: EnumUserRole;
  isBlocked: boolean;
  profileImage?: { url: string; public_id: string };
}
