import { IUser } from '@domain/entities/IUser';
import { LoginResponseDTO } from '@application/dtos/UserAuthDTO';

export interface IAdminAuthUseCases {
  adminLogin(
    email: string,
    password: string
  ): Promise<{
    admin: LoginResponseDTO;
    accessToken: string;
    refreshToken: string;
  }>;

  forgotPasswordOtp(email: string): Promise<void>;

  forgotPasswordChange(userData: IUser, otp: string): Promise<void>;
}
