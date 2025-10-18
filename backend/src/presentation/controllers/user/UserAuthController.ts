import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IUserAuthUseCases } from '@application/useCaseInterfaces/user/IUserAuthUseCases';
import { mapToLoginResponseDTO } from '@application/dtos/UserAuthDTO';
import { EnumUserRole } from '@constants/enum/userEnum';
export class UserAuthController {
  constructor(private _userAuthUseCases: IUserAuthUseCases) { }

  preRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body;
      const referredReferralCode = req.query.referralCode as string;
      console.log(referredReferralCode, 'referralcode');
      await this._userAuthUseCases.preRegistration({
        email,
        username,
        password,
        referredReferralCode,
      });

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
      await this._userAuthUseCases.verifyOtpAndRegister(email, otp);

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
      await this._userAuthUseCases.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: 'OTP resent to your email' });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this._userAuthUseCases.login(
        email,
        password
      );
      
      const MAX_AGE = Number(process.env.MAX_AGE)  

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: MAX_AGE,
        path: '/',
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successful',
        accessToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this._userAuthUseCases.forgotPasswordOtp(email);
      res.status(HttpStatus.OK).json({ message: 'OTP send to your email' });
    } catch (error) {
      next(error);
    }
  };

  verifyOtpForForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const { token } = await this._userAuthUseCases.verifyOtpForForgotPassword(email, otp);
      res.status(HttpStatus.OK).json({
        message: 'OTP Verfied Successfully',
        token
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPasswordChange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this._userAuthUseCases.forgotPasswordChange(token, password);
      res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body;
    if (!token) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing Google token' });
    }
    try {
      const data = await this._userAuthUseCases.loginWithGoole(token);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  userLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('userRefreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
      });

      res.status(HttpStatus.OK).json({ message: 'user logout successful' });
    } catch (error) {
      next(error);
    }
  };

  requestEmailChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserIdFromRequest(req);

      const { newEmail } = req.body;

      await this._userAuthUseCases.requestEmailChange(userId, newEmail);
      res.status(HttpStatus.OK).json({ message: 'OTP sent to new email' });
    } catch (error) {
      next(error);
    }
  };

  verifyAndUpdateEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { newEmail, otp } = req.body;
      const user = await this._userAuthUseCases.verifyAndUpdateEmail(userId, newEmail, otp);
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

      await this._userAuthUseCases.changePassword(userId, currentPassword, newPassword);
      res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  };


  searchUsersForChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const userId = getUserIdFromRequest(req)
      const role = EnumUserRole.USER
       const users = await this._userAuthUseCases.searchUsersForChat(
        userId,
        search,
        role
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: users
      });
    } catch (error) {
      next(error)
    }

  }
}
