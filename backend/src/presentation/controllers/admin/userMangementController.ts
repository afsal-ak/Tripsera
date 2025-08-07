import { Request, Response } from 'express';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';

export class UserManagementController {

  constructor(private _userManagementUseCases: IUserManagementUseCases) {}

  getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, totalUsers, totalPages } = await this._userManagementUseCases.getUsers(
        page,
        limit
      );

      res.status(200).json({
        message: 'Users fetched successfully',
        data: users,
        totalUsers,
        totalPages,
        currentPage: page,
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  getSingleUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this._userManagementUseCases.getSingleUser(userId);
      res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      await this._userManagementUseCases.blockUser(userId);
      res.status(200).json({ message: 'User blocked successfully' });
    } catch (error: any) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      await this._userManagementUseCases.unblockUser(userId);
      res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error: any) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
}
