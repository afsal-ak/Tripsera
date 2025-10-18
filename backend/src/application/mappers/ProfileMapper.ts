import { IUser } from "@domain/entities/IUser";
import { ProfileDTO, PublicProfileDTO } from "@application/dtos/ProfileDTO";

export abstract class ProfileMapper {
  
  /**  Convert IUser → ProfileDTO (Full Profile) */
  static toProfileDTO(user: IUser): ProfileDTO {
    return {
      _id: user._id!.toString(),
      username: user.username!,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      phone: user.phone,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      followers: (user.followers as string[]) ?? [],
      following: (user.following as string[]) ?? [],
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isPrivate: user.isPrivate,
      interests: user.interests,
      address: user.address,
      referralCode: user.referralCode,
    };
  }

  /** Public Profile */
  static toPublicProfileDTO(user: IUser): PublicProfileDTO {
    return {
      _id: user._id!.toString(),
      username: user.username!,
      fullName: user.fullName,
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      followers: (user.followers as string[]) ?? [],
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }
}
