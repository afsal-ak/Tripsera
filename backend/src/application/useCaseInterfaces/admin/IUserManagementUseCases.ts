import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { AdminUserListDTO } from '@application/dtos/UserDTO';
import { IUser } from '@domain/entities/IUser';
export interface IUserManagementUseCases {
  getUsers(
    page: number,
    limit: number,filters:IFilter
  ): Promise<IPaginatedResult<AdminUserListDTO>>;

  getSingleUser(userId: string): Promise<IUser>;
  toggleUserBlockStatus(userId: string): Promise<boolean>  
 searchAllUsersForAdmin(
  search: string
): Promise<IUser[]>
}
