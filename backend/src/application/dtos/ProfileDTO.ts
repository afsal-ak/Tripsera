import {  EnumGender } from "@constants/enum/userEnum";

export interface UpdateProfileDTO {
  fullName?: string;
  bio?: string;
  gender?: EnumGender;
  dob?: Date;
  interests?: string[];
  links?: { platform: string; url: string }[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}
export interface UpdateAddressDTO {
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}


/** Full Profile Response DTO (Private) */
export interface ProfileDTO {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  phone?: number;
  profileImage?: {
    url: string;
    public_id: string;
  };
  coverImage?: {
    url: string;
    public_id: string;
  };
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  isPrivate?: boolean;
  interests?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  referralCode?: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface PublicProfileDTO {
  _id: string;
  username: string;
  fullName?: string;
  bio?: string;
  profileImage?: {
    url: string;
    public_id: string;
  };
  coverImage?: {
    url: string;
    public_id: string;
  };
  followers: string[];
  followersCount: number;
  followingCount: number;
}
