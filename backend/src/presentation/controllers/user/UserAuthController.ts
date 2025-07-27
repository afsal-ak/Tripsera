import { NextFunction, Request, Response } from 'express';
import { UserAuthUsecases } from '@domain/usecases/user/userAuthUseCases';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
export class UserAuthController {
  constructor(private userAuthUseCases: UserAuthUsecases) { }


  preRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body;
      await this.userAuthUseCases.preRegistration({ email, username, password });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'OTP sent to your email',
      });
    } catch (error: any) {
      next(error);
    }
  };


  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      await this.userAuthUseCases.verifyOtpAndRegister(email, otp);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.userAuthUseCases.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: 'OTP resent to your email' });
    } catch (error: any) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.userAuthUseCases.login(email, password);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful',
        data: { user, accessToken },
      });
    } catch (error: any) {
      next(error);
    }
  };


  forgotPassword = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.userAuthUseCases.forgotPasswordOtp(email);
      res.status(HttpStatus.OK).json({ message: 'OTP send to your email' });
    } catch (error: any) {
      next(error);
    }
  };

  verifyOtpForForgotPassword = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const { token } = await this.userAuthUseCases.verifyOtpForForgotPassword(email, otp);
       res.status(HttpStatus.OK).json({ message: 'OTP Verfied Successfully', token });
    } catch (error: any) {
      next(error);
    }
  };

  forgotPasswordChange = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.userAuthUseCases.forgotPasswordChange(token, password);
      res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { token } = req.body;
    if (!token) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing Google token' });
    }
    try {
      const data = await this.userAuthUseCases.loginWithGoole(token);
      res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  };

  userLogout = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      res.clearCookie('userRefreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
      });

      res.status(HttpStatus.OK).json({ message: 'Admin logout successful' });
    } catch (error: any) {
      next(error);
    }
  };

  requestEmailChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);

      const { newEmail } = req.body;

      await this.userAuthUseCases.requestEmailChange(userId, newEmail);
      res.status(HttpStatus.OK).json({ message: 'OTP sent to new email' });
    } catch (error) {
      next(error);
    }
  };

  verifyAndUpdateEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { newEmail, otp } = req.body;
      const user = await this.userAuthUseCases.verifyAndUpdateEmail(userId, newEmail, otp);
      res.status(HttpStatus.OK).json({
        message: 'Email updated successfully',
        email: user?.email,
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = getUserIdFromRequest(req);

      await this.userAuthUseCases.changePassword(userId, currentPassword, newPassword);
      res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
