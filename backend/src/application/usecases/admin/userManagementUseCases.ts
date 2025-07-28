import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IUser } from '@domain/entities/IUser';
import { IUserPreview } from '@domain/entities/IUserPreview ';

export class UserManagementUseCases {
  constructor(private userRepository: IUserRepository) {}

  async getUsers(
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      this.userRepository.findAll(skip, limit),
      this.userRepository.countAll(),
    ]);

    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    };
  }
  async getSingleUser(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.updateUserStatus(userId, true);
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.updateUserStatus(userId, false);
  }
}
