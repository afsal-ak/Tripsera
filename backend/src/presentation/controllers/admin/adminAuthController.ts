import { Request, Response } from 'express';
import { IUser } from '@domain/entities/IUser';
import { IAdminAuthUseCases } from '@application/useCaseInterfaces/admin/IAdminAuthUseCases';
export class AdminAuthController {
  constructor(private adminAuthUseCases: IAdminAuthUseCases) {}

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await this.adminAuthUseCases.adminLogin(
        email,
        password
      );
      res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      console.log(req.cookies, 'k');
      console.log({ accessToken, refreshToken });
      res.status(200).json({
        message: 'Login successful',
        admin,
        accessToken,
      });
    } catch (error: any) {
      console.log(error);
      res.status(401).json({ message: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.adminAuthUseCases.forgotPasswordOtp(email);
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  forgotPasswordChange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, otp } = req.body;
      const adminData: IUser = { email, password };
      await this.adminAuthUseCases.forgotPasswordChange(adminData, otp);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  adminLogout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
      });

      res.status(200).json({ message: 'Admin logout successful' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}
