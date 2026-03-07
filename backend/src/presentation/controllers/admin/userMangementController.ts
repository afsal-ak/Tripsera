import { Request, Response, NextFunction } from 'express';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';
import { UserMessages } from '@constants/messages/admin/UserMessages';
export class UserManagementController {
  constructor(private _userManagementUseCases: IUserManagementUseCases) {}

  getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
      };
      const data = await this._userManagementUseCases.getUsers(page, limit, filters);
      res.status(HttpStatus.OK).json({
        message: UserMessages.USERS_FETCHED_SUCCESS,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getSingleUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const data = await this._userManagementUseCases.getSingleUser(userId);
      res.status(HttpStatus.OK).json({ message:UserMessages.USER_FETCHED_SUCCESS, user: data });
    } catch (error) {
      next(error);
    }
  };

  toggleBlockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const newStatus = await this._userManagementUseCases.toggleUserBlockStatus(userId);

      res.status(HttpStatus.OK).json({
        message: newStatus ? UserMessages.USER_BLOCKED_SUCCESS : UserMessages.USER_UNBLOCKED_SUCCESS,
        isBlocked: newStatus,
      });
    } catch (error) {
      next(error);
    }
  };

  searchAllUsersForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const search = (req.query.search as string) || '';
      const users = await this._userManagementUseCases.searchAllUsersForAdmin(search);

      res.status(HttpStatus.OK).json({
        success: true,
        message: UserMessages.USERS_FETCHED_SUCCESS,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}
