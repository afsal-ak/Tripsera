import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { AdminUserListResponseDTO, UserDetailsResponseDTO } from '@application/dtos/UserDTO';

export interface IUserManagementUseCases {
  getUsers(
    page: number,
    limit: number,filters:IFilter
  ): Promise<IPaginatedResult<AdminUserListResponseDTO>>;

  getSingleUser(userId: string): Promise<UserDetailsResponseDTO>;
  toggleUserBlockStatus(userId: string): Promise<boolean>  
 searchAllUsersForAdmin(
  search: string
): Promise<AdminUserListResponseDTO[]>
}
