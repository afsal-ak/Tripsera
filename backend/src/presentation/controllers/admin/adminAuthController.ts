import { NextFunction, Request, Response } from 'express';
import { IUser } from '@domain/entities/IUser';
import { IAdminAuthUseCases } from '@application/useCaseInterfaces/admin/IAdminAuthUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class AdminAuthController {
  constructor(private _adminAuthUseCases: IAdminAuthUseCases) { }

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await this._adminAuthUseCases.adminLogin(
        email,
        password
      );
      const MAX_AGE = Number(process.env.MAX_AGE)

      res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: MAX_AGE,
        path: '/',
      });

      res.status(HttpStatus.OK).json({
        message: 'Login successful',
        admin,
        accessToken,
      });
    } catch (error: any) {
      next(error)
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this._adminAuthUseCases.forgotPasswordOtp(email);
      res.status(HttpStatus.OK).json({ message: 'OTP sent to your email' });
    } catch (error) {
      next(error)
    }
  };

  forgotPasswordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, otp } = req.body;
      const adminData: IUser = { email, password };
      await this._adminAuthUseCases.forgotPasswordChange(adminData, otp);
      res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error)
    }
  };

  adminLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
      });

      res.status(HttpStatus.OK).json({ message: 'Admin logout successful' });
    } catch (error) {
      next(error)
    }
  };
}
