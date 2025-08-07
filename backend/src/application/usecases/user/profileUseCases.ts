import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IUser } from '@domain/entities/IUser';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { AppError } from '@shared/utils/AppError';
import { IUserRepository } from '@domain/repositories/IUserRepository';
export class ProfileUseCases {
  constructor(private userRepo: UserRepository) { }

  async getUserProfile(userId: string): Promise<IUser | null> {
    return await this.userRepo.getUserProfile(userId);
  }

  async updateProfileImage(
    userId: string,
    profileImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    return await this.userRepo.updateProfileImage(userId, profileImage);
  }
  async createCoverImage(
    userId: string,
    coverImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    return await this.userRepo.createCoverImage(userId, coverImage);
  }

  async updateUserProfile(userId: string, profileData: Partial<IUser>): Promise<IUser | null> {
    return await this.userRepo.updateUserProfile(userId, profileData);
  }

  async updateUserAddress(userId: string, addressData: Partial<IUser>): Promise<IUser | null> {
    return await this.userRepo.updateUserAddress(userId, addressData);
  }


  async getPublicProfile(username: string): Promise<IUser | null> {
    const user = await this.userRepo.findByUsername(username);

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }
 
    return user;
  }

async followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) {
    throw new AppError(400, "Cannot follow yourself");
  }

  await this.userRepo.addFollowerAndFollowing(followerId, followingId);
}

async unfollowUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) {
    throw new AppError(400, "Cannot follow yourself");
  }

  await this.userRepo.unFollowAndFollowing(followerId, followingId);
}


}
