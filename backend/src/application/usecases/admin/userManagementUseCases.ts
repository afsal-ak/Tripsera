import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IUser } from '@domain/entities/IUser';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';

export class UserManagementUseCases implements IUserManagementUseCases {

  constructor(private _userRepository: IUserRepository) {}

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
      this._userRepository.findAll(skip, limit),
      this._userRepository.countAll(),
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
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
async toggleUserBlockStatus(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newStatus = !user.isBlocked;
    await this._userRepository.updateUserStatus(userId, newStatus);

    return newStatus; // true if blocked, false if unblocked
  }
  
  async blockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await this._userRepository.updateUserStatus(userId, true);
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await this._userRepository.updateUserStatus(userId, false);
  }
}
