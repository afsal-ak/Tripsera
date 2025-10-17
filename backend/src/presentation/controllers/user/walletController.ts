import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IWalletUseCases } from '@application/useCaseInterfaces/user/IWalletUseCases';
import { EnumSort } from '@constants/enum/sortEnum';

export class WalletController {
  constructor(private _walletUseCases: IWalletUseCases) {}

  walletBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { balance } = await this._walletUseCases.getUserWallet(userId);

      res.status(HttpStatus.OK).json({
        balance,
        message: 'Wallet balance fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getUserWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest'   

      //     console.log(req.query,'from wallet')

      const { balance, transactions, total } = await this._walletUseCases.getUserWallet(userId, {
        page,
        limit,
        sort,
      });

      res.status(HttpStatus.OK).json({
        balance,
        transactions,
        total,
        message: 'wallet fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  creditWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { amount, description }: { amount: number; description: string } = req.body;

      if (typeof amount !== 'number' || amount <= 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid amount' });
        return;
      }

      const wallet = await this._walletUseCases.creditWallet(userId, amount, description);
      res.status(HttpStatus.OK).json({
        wallet,
        message: 'Wallet credited successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  debitWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { amount, description }: { amount: number; description: string } = req.body;

      if (typeof amount !== 'number' || amount <= 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid amount' });
        return;
      }

      const wallet = await this._walletUseCases.debitWallet(userId, amount, description);
      res.status(HttpStatus.OK).json({
        wallet,
        message: 'Wallet debited successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
