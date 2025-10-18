import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { AdminUserListResponseDTO,UserDetailsResponseDTO } from '@application/dtos/UserDTO';
 import { UserMapper } from '@application/mappers/UserMapper';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';


export class UserManagementUseCases implements IUserManagementUseCases {

  constructor(private _userRepository: IUserRepository) { }

  async getUsers(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<
    IPaginatedResult<AdminUserListResponseDTO>
  > {

    const result= await this._userRepository.findAll(page, limit, filters)
    return {
      ...result,
       data: result.data.map(UserMapper.toAdminUserListDTO),
    }


  }
  async getSingleUser(userId: string): Promise<UserDetailsResponseDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND,'User not found');
    }
    return UserMapper.toUserDetailsDTO(user);
  }
  async toggleUserBlockStatus(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND,'User not found');
    }

    const newStatus = !user.isBlocked;
    await this._userRepository.updateUserStatus(userId, newStatus);

    return newStatus; // true if blocked, false if unblocked
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND,'User not found');
    }
    await this._userRepository.updateUserStatus(userId, true);
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND,'User not found');
    }
    await this._userRepository.updateUserStatus(userId, false);
  }

  async searchAllUsersForAdmin(search: string): Promise<AdminUserListResponseDTO[]> {
    const user= await this._userRepository.searchAllUsersForAdmin(search)
    return user.map(UserMapper.toAdminUserListDTO)
  }


}
