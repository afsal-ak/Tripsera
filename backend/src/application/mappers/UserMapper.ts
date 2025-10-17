import { IUser } from '@domain/entities/IUser';
import { UserDetailsResponseDTO, AdminUserListResponseDTO,
    UserBasicResponseDTO,
 } from '@application/dtos/UserDTO';
import { EnumUserRole ,EnumGender} from '@constants/enum/userEnum';
import { LoginResponseDTO } from '@application/dtos/UserAuthDTO';

export abstract class UserMapper {

  static toUserDetailsDTO(user: IUser): UserDetailsResponseDTO {
    return {
      _id: user._id!.toString(),
      username: user.username || '',
      email: user.email,
      role: user.role || EnumUserRole.USER,
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
    };
  }

   static toBasicResponse(user: IUser): UserBasicResponseDTO {
    return {
      _id: user._id!.toString(),
      username: user.username || '',
      email: user.email,
      role: user.role || EnumUserRole.USER,
      fullName: user.fullName,
      profileImage: user.profileImage,
      gender: user.gender as EnumGender,
      isBlocked: !!user.isBlocked,
    };
  }
  
  static mapToLoginResponseDTO = (user: IUser): LoginResponseDTO => ({
    _id: user._id!.toString(),
    username: user.username || '',
    email: user.email,
    role:  user.role || EnumUserRole.USER,
    profileImage: user.profileImage,
    fullName: user.fullName,
    phone: user.phone,
  });
  

  static toAdminUserListDTO(user: IUser): AdminUserListResponseDTO {
    return {
      _id: user._id!.toString(),
      username: user.username || '',
      email: user.email,
      fullName: user.fullName,
      role: user.role || EnumUserRole.USER,
      isBlocked: !!user.isBlocked,
      profileImage: user.profileImage,
    };
  }
}
