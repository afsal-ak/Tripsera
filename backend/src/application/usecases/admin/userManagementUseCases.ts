import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IUser } from '@domain/entities/IUser';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { mapToAdminUserListResponseDTO,AdminUserListDTO } from '@application/dtos/UserDTO';
      //const user=users.map(mapToAdminUserListResponseDTO)

export class UserManagementUseCases implements IUserManagementUseCases {

  constructor(private _userRepository: IUserRepository) { }

  async getUsers(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<
    IPaginatedResult<AdminUserListDTO>
  > {

    const result= await this._userRepository.findAll(page, limit, filters)
    return {
      ...result,
       data: result.data.map(mapToAdminUserListResponseDTO),
    }


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

  async searchAllUsersForAdmin(search: string): Promise<IUser[]> {
    return await this._userRepository.searchAllUsersForAdmin(search)
  }


}
