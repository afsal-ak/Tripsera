import { IUser } from '@domain/entities/IUser';

export interface IUserAuthUseCases {
  preRegistration(userData: any): Promise<void>;
  verifyOtpAndRegister(email: string, otp: string): Promise<void>;
  resendOtp(email: string): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>;
  forgotPasswordOtp(email: string): Promise<void>;
  verifyOtpForForgotPassword(email: string, otp: string): Promise<{ token: string }>;
  forgotPasswordChange(token: string, password: string): Promise<void>;
  loginWithGoole(token: string): Promise<{ accessToken: string; user: IUser }>;
  requestEmailChange(userId: string, newEmail: string): Promise<void>;
  verifyAndUpdateEmail(userId: string, newEmail: string, otp: string): Promise<IUser | null>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
