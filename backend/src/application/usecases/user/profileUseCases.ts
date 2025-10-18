import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IUser } from '@domain/entities/IUser';
import { AppError } from '@shared/utils/AppError';
import { IProfileUseCases } from '@application/useCaseInterfaces/user/IProfileUseCases';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { EnumUserRole } from '@constants/enum/userEnum';
import { EnumNotificationEntityType, EnumNotificationType } from '@constants/enum/notificationEnum';
import { UpdateProfileDTO, ProfileDTO, PublicProfileDTO, UpdateAddressDTO } from '@application/dtos/ProfileDTO';
import { ProfileMapper } from '@application/mappers/ProfileMapper';

export class ProfileUseCases implements IProfileUseCases {

  constructor(
    private _userRepo: IUserRepository,
    private _notificationUseCases: INotificationUseCases
  ) { }

  async getUserProfile(userId: string): Promise<ProfileDTO | null> {
    const profile = await this._userRepo.getUserProfile(userId);
    return profile ? ProfileMapper.toProfileDTO(profile) : null

  }

  async updateProfileImage(
    userId: string,
    profileImage: { url: string; public_id: string }
  ): Promise<ProfileDTO | null> {
    const profile = await this._userRepo.updateProfileImage(userId, profileImage);
    return profile ? ProfileMapper.toProfileDTO(profile) : null

  }
  async createCoverImage(
    userId: string,
    coverImage: { url: string; public_id: string }
  ): Promise<ProfileDTO | null> {
    const profile = await this._userRepo.createCoverImage(userId, coverImage);
    return profile ? ProfileMapper.toProfileDTO(profile) : null

  }

  async updateUserProfile(userId: string, profileData: UpdateProfileDTO): Promise<ProfileDTO | null> {
    const profile = await this._userRepo.updateUserProfile(userId, profileData);
    return profile ? ProfileMapper.toProfileDTO(profile) : null

  }
async updateUserAddress(userId: string, addressData: UpdateAddressDTO): Promise<ProfileDTO | null> {
  const profile = await this._userRepo.updateUserAddress(userId, addressData);
  return profile ? ProfileMapper.toProfileDTO(profile) : null;
}

  async getPublicProfile(username: string): Promise<PublicProfileDTO | null> {
    const profile = await this._userRepo.findByUsername(username);

    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    return profile ? ProfileMapper.toProfileDTO(profile) : null
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot follow yourself');
    }

    this._userRepo.addFollowerAndFollowing(followerId, followingId);
    const user = await this._userRepo.findById(followerId)
    const notification = await this._notificationUseCases.sendNotification({
      userId: followingId,
      role: EnumUserRole.USER,
      title: "New Follower",
      entityType: EnumNotificationEntityType.FOLLOW,
      message: `  ${user?.username} started following you`,
      type: EnumNotificationType.SUCCESS,
      triggeredBy: followerId,

    });
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot follow yourself');
    }

    await this._userRepo.unFollowAndFollowing(followerId, followingId);
  }

  async setProfilePrivacy(userId: string, isPrivate: boolean): Promise<ProfileDTO | null> {
    const profile =await this._userRepo.setProfilePrivacy(userId, isPrivate)
    return profile ? ProfileMapper.toProfileDTO(profile) : null
  }

}
