import { Request,Response } from "express";
import { AdminAuthUseCases } from "@domain/usecases/admin/adminAuthUseCases";
import { IUser } from "@domain/entities/IUser";

export class AdminAuthController {
  constructor(private adminAuthUseCases: AdminAuthUseCases) {}

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } =
        await this.adminAuthUseCases.adminLogin(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: 'Login successful',
        admin,
        accessToken,
      });
    } catch (error: any) {
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
}
