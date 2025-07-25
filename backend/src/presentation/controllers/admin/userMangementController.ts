import { Request, Response } from 'express';
import { UserManagementUseCases } from '@domain/usecases/admin/userManagementUseCases';

export class UserManagementController {
  constructor(private userManagementUseCases: UserManagementUseCases) {}

  getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { users, totalUsers, totalPages } = await this.userManagementUseCases.getUsers(
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
      const user = await this.userManagementUseCases.getSingleUser(userId);
      res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      await this.userManagementUseCases.blockUser(userId);
      res.status(200).json({ message: 'User blocked successfully' });
    } catch (error: any) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      await this.userManagementUseCases.unblockUser(userId);
      res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error: any) {
      console.error('Error blocking user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
}
