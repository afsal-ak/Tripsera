import { Request, Response, NextFunction } from 'express';
import { IBlockUseCase } from '@application/useCaseInterfaces/user/IBlockUseCases';
import { CreateBlockDTO } from '@application/dtos/BlockDTO';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class BlockController {
  constructor(private _blockUseCase: IBlockUseCase) {}

  // Block a user
  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blockerId = getUserIdFromRequest(req);
      const dto: CreateBlockDTO = req.body;

      const block = await this._blockUseCase.blockUser(blockerId, dto);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: block,
        message: 'User blocked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Unblock a user
  unblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blockerId = getUserIdFromRequest(req);
      const { blockedId } = req.body;

      const success = await this._blockUseCase.unblockUser(blockerId, blockedId);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: success,
        message: 'User unblocked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Check if a user is blocked
  isBlocked = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blockerId = getUserIdFromRequest(req);
      const { blockedId } = req.params;

      const blocked = await this._blockUseCase.isBlocked(blockerId, blockedId);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: blocked,
        message: 'User isBlocked checked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all users blocked by the current user
  listBlockedUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);

      const blockedUsers = await this._blockUseCase.getBlockedUsers(userId);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: blockedUsers,
        message: 'Fetched all blocked users',
      });
    } catch (error) {
      next(error);
    }
  };
}
