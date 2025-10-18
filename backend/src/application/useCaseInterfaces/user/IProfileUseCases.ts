import {UpdateProfileDTO, ProfileDTO, PublicProfileDTO, UpdateAddressDTO } from "@application/dtos/ProfileDTO";

export interface IProfileUseCases {
  getUserProfile(userId: string): Promise<ProfileDTO  | null>;

  updateProfileImage(
    userId: string,
    profileImage: { url: string; public_id: string }
  ): Promise<ProfileDTO  | null>;

  createCoverImage(
    userId: string,
    coverImage: { url: string; public_id: string }
  ): Promise<ProfileDTO  | null>;

  updateUserProfile(userId: string, profileData: UpdateProfileDTO): Promise<ProfileDTO  | null>;

  updateUserAddress(userId: string, addressData:UpdateAddressDTO): Promise<ProfileDTO  | null>;

  getPublicProfile(username: string): Promise<PublicProfileDTO | null>;

  followUser(followerId: string, followingId: string): Promise<void>;

  unfollowUser(followerId: string, followingId: string): Promise<void>;

  setProfilePrivacy(userId: string, isPrivate: boolean): Promise<ProfileDTO|null>;

}
