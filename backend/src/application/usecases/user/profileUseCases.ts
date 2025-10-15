import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IUser } from '@domain/entities/IUser';
 import { AppError } from '@shared/utils/AppError';
import { IProfileUseCases } from '@application/useCaseInterfaces/user/IProfileUseCases';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { EnumUserRole } from '@constants/enum/userEnum';


export class ProfileUseCases implements IProfileUseCases {

  constructor(
    private _userRepo: IUserRepository,
    private _notificationUseCases: INotificationUseCases
  ) { }

  async getUserProfile(userId: string): Promise<IUser | null> {
    return await this._userRepo.getUserProfile(userId);
  }

  async updateProfileImage(
    userId: string,
    profileImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    return await this._userRepo.updateProfileImage(userId, profileImage);
  }
  async createCoverImage(
    userId: string,
    coverImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    return await this._userRepo.createCoverImage(userId, coverImage);
  }

  async updateUserProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    return await this._userRepo.updateUserProfile(userId, profileData);
  }

  async updateUserAddress(userId: string, addressData: Partial<IUser>): Promise<IUser | null> {
    return await this._userRepo.updateUserAddress(userId, addressData);
  }

  async getPublicProfile(username: string): Promise<IUser | null> {
    const user = await this._userRepo.findByUsername(username);

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot follow yourself');
    }

     this._userRepo.addFollowerAndFollowing(followerId, followingId);
     const user=await this._userRepo.findById(followerId)
    const notification = await this._notificationUseCases.sendNotification({
      userId: followingId,
      role: EnumUserRole.USER,
      title: "New Follower",
      entityType: 'follow',
      message: `  ${user?.username} started following you`,
      type: "success",
      triggeredBy: followerId,

    });
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Cannot follow yourself');
    }

    await this._userRepo.unFollowAndFollowing(followerId, followingId);
  }

  async setProfilePrivacy(userId: string, isPrivate: boolean): Promise<IUser | null> {
    return this._userRepo.setProfilePrivacy(userId, isPrivate)
  }

}
