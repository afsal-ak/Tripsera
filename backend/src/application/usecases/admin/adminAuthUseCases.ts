import { IUser } from '@domain/entities/IUser';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { IOtpRepository } from '@domain/repositories/IOtpRepository';
import { generateOtp } from '@shared/utils/generateOtp';
import { hashPassword, comparePassword } from '@shared/utils/hash';
import { sendOtpMail } from '@infrastructure/services/mail/mailer';
import { generateAccessToken, generateRefreshToken } from '@shared/utils/jwt';
import { IAdminAuthUseCases } from '@application/useCaseInterfaces/admin/IAdminAuthUseCases';

export class AdminAuthUseCases implements IAdminAuthUseCases {
  constructor(
    private _adminRepository: IUserRepository,
    private _otpRepository: IOtpRepository
  ) {}

  async adminLogin(
    email: string,
    password: string
  ): Promise<{
    admin: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const admin = await this._adminRepository.findByEmail(email);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Incorrect email or password');
    }
    const isPasswordMatch = admin?.password
      ? await comparePassword(password, admin.password)
      : false;
    if (!isPasswordMatch) {
      throw new Error('Incorrect email or password');
    }
    const payload = {
      id: admin._id,
      role: admin.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const publicAdmin = {
      _id: admin._id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    } as IUser;

    return {
      admin: publicAdmin,
      accessToken,
      refreshToken,
    };
  }

  async forgotPasswordOtp(email: string): Promise<void> {
    const existingEmail = await this._adminRepository.findByEmail(email);
    if (!existingEmail || existingEmail.role !== 'admin') {
      throw new Error('Invalid Email');
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.saveOtp({ email, otp, expiresAt });
    await sendOtpMail(email, otp);
  }

  async forgotPasswordChange(userData: IUser, otp: string): Promise<void> {
    const { email, password } = userData;

    const isValidOtp = await this._otpRepository.verifyOtp(email, otp);
    if (!isValidOtp) {
      throw new Error('Invalid or Expired OTP');
    }
    const hashedPassword = await hashPassword(password!);

    await this._adminRepository.updateUserPassword(email, hashedPassword);
    await this._otpRepository.deleteOtp(email);
  }
}
