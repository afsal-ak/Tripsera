import { IUser } from '@domain/entities/IUser';

export interface IAdminAuthUseCases {
  adminLogin(
    email: string,
    password: string
  ): Promise<{
    admin: IUser;
    accessToken: string;
    refreshToken: string;
  }>;

  forgotPasswordOtp(email: string): Promise<void>;

  forgotPasswordChange(userData: IUser, otp: string): Promise<void>;
}
