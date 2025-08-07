import { IUser } from '@domain/entities/IUser';

export interface IProfileUseCases {
  getUserProfile(userId: string): Promise<IUser | null>;

  updateProfileImage(
    userId: string,
    profileImage: { url: string; public_id: string }
  ): Promise<IUser | null>;

  createCoverImage(
    userId: string,
    coverImage: { url: string; public_id: string }
  ): Promise<IUser | null>;

  updateUserProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null>;

  updateUserAddress(userId: string, addressData: Partial<IUser>): Promise<IUser | null>;

  getPublicProfile(username: string): Promise<IUser | null>;

  followUser(followerId: string, followingId: string): Promise<void>;

  unfollowUser(followerId: string, followingId: string): Promise<void>;
}
