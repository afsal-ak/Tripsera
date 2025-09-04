import { Request, Response,NextFunction } from 'express';
import { IUserManagementUseCases } from '@application/useCaseInterfaces/admin/IUserManagementUseCases';
import { mapToAdminUserListResponseDTO,mapToUserDetailsDTO } from "@application/dtos/UserDTO";
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

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
      const user=users.map(mapToAdminUserListResponseDTO)
      console.log(user, 'from admin')
      res.status(HttpStatus.OK).json({
        message: 'Users fetched successfully',
        data: user,
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
      const data = await this._userManagementUseCases.getSingleUser(userId);
      const user=mapToUserDetailsDTO(data)
      res.status(HttpStatus.OK).json({ message: 'User fetched successfully', user });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
  
 toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const newStatus = await this._userManagementUseCases.toggleUserBlockStatus(userId);

      res.status(HttpStatus.OK).json({
        message: newStatus ? 'User blocked successfully' : 'User unblocked successfully',
        isBlocked: newStatus
      });
    } catch (error: any) {
      console.error('Error toggling user block status:', error);
      res
        .status(500)
        .json({ message: error.message || 'Something went wrong' });
    }
  };

  
    searchAllUsersForAdmin = async (req: Request,res: Response,next:NextFunction):Promise<void> => {
  try {
    const search = (req.query.search as string) || "";
console.error(search,'saechhhh')
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
