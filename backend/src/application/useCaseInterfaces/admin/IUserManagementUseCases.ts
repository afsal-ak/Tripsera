import { IUser } from '@domain/entities/IUser';

export interface IUserManagementUseCases {
  getUsers(
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
  }>;

  getSingleUser(userId: string): Promise<IUser>;

  blockUser(userId: string): Promise<void>;

  unblockUser(userId: string): Promise<void>;
}
