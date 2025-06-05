import { Request, Response } from "express";
import { UserAuthUsecases } from "@domain/usecases/user/userAuthUseCases";
import { IUser } from "@domain/entities/IUser";

export class UserAuthController {
  constructor(
    private userAuthUseCases: UserAuthUsecases
  ) {}

  preRegister = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username } = req.body;
      await this.userAuthUseCases.preRegistration(email, username);
      res.status(200).json({ message: "OTP send to your email" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username, password, otp } = req.body;
      const userData: IUser = { email, username, password };
      await this.userAuthUseCases.verifyOtpAndRegister(userData, otp);
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.userAuthUseCases.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        message: 'Login successful',
        user,
        accessToken
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      await this.userAuthUseCases.forgotPasswordOtp(email);
      res.status(200).json({ message: "OTP send to your email" });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  forgotPasswordChange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, otp } = req.body;
      const userData: IUser = { email, password };
      console.log(req.body);
      await this.userAuthUseCases.forgotPasswordChange(userData, otp);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}
