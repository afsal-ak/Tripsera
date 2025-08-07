import { IUser } from '@domain/entities/IUser';

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

export const mapToPublicProfileDTO = (user: IUser): PublicProfileDTO => ({
  _id: user._id!.toString(),
  username: user.username!,
  fullName: user.fullName,
  bio: user.bio,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  followers: user.followers as string[],
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
});
