import { Request, Response, NextFunction } from 'express';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';
import {  mapToUserDetailsDTO } from "@application/dtos/UserDTO";
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';

export class UserManagementController {

  constructor(private _userManagementUseCases: IUserManagementUseCases) { }

  getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: IFilter = {
        search: (req.query.search as string) || "",
        status: (req.query.status as string) || "",

      };
      const data = await this._userManagementUseCases.getUsers(
        page,
        limit, filters
      );
      res.status(HttpStatus.OK).json({
        message: 'Users fetched successfully',
        data
      });
    } catch (error) {
      next(error)
    }
  };

  getSingleUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const data = await this._userManagementUseCases.getSingleUser(userId);
      const user = mapToUserDetailsDTO(data)
      res.status(HttpStatus.OK).json({ message: 'User fetched successfully', user });
    } catch (error) {
      next(error)
    }
  };

  toggleBlockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const newStatus = await this._userManagementUseCases.toggleUserBlockStatus(userId);

      res.status(HttpStatus.OK).json({
        message: newStatus ? 'User blocked successfully' : 'User unblocked successfully',
        isBlocked: newStatus
      });
    } catch (error) {
      next(error)
    }
  };


  searchAllUsersForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const users = await this._userManagementUseCases.searchAllUsersForAdmin(search);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      next(error)
    }
  };


}
