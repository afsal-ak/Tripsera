import { IUser } from '@domain/entities/IUser';

export interface UserDetailsDTO {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  fullName?: string;
  phone?: number;
  dob?: Date;
  gender?: 'male' | 'female';
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

export const mapToUserDetailsDTO = (user: IUser): UserDetailsDTO => ({
  _id: user._id!.toString(),
  username: user.username || '',
  email: user.email,
  role: user.role || 'user',
  isBlocked: !!user.isBlocked,
  fullName: user.fullName,
  phone: user.phone,
  dob: user.dob,
  gender: user.gender,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  bio: user.bio,
  links: user.links,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
  interests: user.interests,
  address: user.address,
  referralCode: user.referralCode,
  referredBy: user.referredBy?.toString(),
  isGoogleUser: !!user.isGoogleUser,
});



export interface AdminUserListDTO {
  _id: string;
  username: string;
  email: string;
 fullName?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  profileImage?: { url: string; public_id: string };
}

export const mapToAdminUserListResponseDTO = (user: IUser ): AdminUserListDTO => ({
  _id: user._id!.toString(),
  username: user.username || '',
  email: user.email,
  role: user.role || 'user',
  isBlocked:!!user.isBlocked,
   fullName: user.fullName,
});
