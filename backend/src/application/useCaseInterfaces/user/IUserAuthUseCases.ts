import { EnumUserRole } from '@constants/enum/userEnum';

import { LoginResponseDTO, PreRegistrationDTO } from '@application/dtos/UserAuthDTO';
import { UserBasicResponseDTO } from '@application/dtos/UserDTO';
export interface IUserAuthUseCases {
  preRegistration(userData: PreRegistrationDTO): Promise<void>;
  verifyOtpAndRegister(email: string, otp: string): Promise<void>;
  resendOtp(email: string): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    user: LoginResponseDTO;
    accessToken: string;
    refreshToken: string;
  }>;
  forgotPasswordOtp(email: string): Promise<void>;
  verifyOtpForForgotPassword(email: string, otp: string): Promise<{ token: string }>;
  forgotPasswordChange(token: string, password: string): Promise<void>;
  loginWithGoole(token: string): Promise<{ accessToken: string; user: LoginResponseDTO }>;
  requestEmailChange(userId: string, newEmail: string): Promise<void>;
  verifyAndUpdateEmail(userId: string, newEmail: string, otp: string): Promise<UserBasicResponseDTO | null>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
  searchUsersForChat(userId: string, search: string, role: EnumUserRole): Promise<UserBasicResponseDTO[] | null>

}
