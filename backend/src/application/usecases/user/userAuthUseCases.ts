import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IOtpRepository } from '../../../domain/repositories/IOtpRepository';
import { sendOtpMail } from '@infrastructure/services/mail/mailer';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { hashPassword, comparePassword } from '@shared/utils/hash';
import { IUser } from '../../../domain/entities/IUser';
import { EnumUserRole } from '@constants/enum/userEnum';
import { generateOtp } from '@shared/utils/generateOtp';
import { verifyGoogleToken } from '@infrastructure/services/googleAuth/googleAuthService';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from '@shared/utils/jwt';
import { AppError } from '@shared/utils/AppError';
import { generateUniqueReferralCode } from '@shared/utils/generateRefferalCode';
import { IReferralRepository } from '@domain/repositories/IReferralRepository';
import { IUserAuthUseCases } from '@application/useCaseInterfaces/user/IUserAuthUseCases';
import {
  LoginResponseDTO,
  PreRegistrationDTO,
} from '@application/dtos/UserAuthDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { UserBasicResponseDTO } from '@application/dtos/UserDTO';
import { UserMapper } from '@application/mappers/UserMapper';

export class UserAuthUsecases implements IUserAuthUseCases {
  constructor(
    private _userRepository: IUserRepository,
    private _otpRepository: IOtpRepository,
    private _walletRepository: IWalletRepository,
    private _referraRepository: IReferralRepository
  ) {}

  async preRegistration(userData: PreRegistrationDTO): Promise<void> {
    const { email, username, password, referredReferralCode } = userData;

    const existingEmail = await this._userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError(HttpStatus.CONFLICT, 'Email already taken');
    }

    const existingUsername = await this._userRepository.findByUsername(username!);
    if (existingUsername) {
      throw new AppError(HttpStatus.CONFLICT, 'Username already taken');
    }

    const hashedPassword = await hashPassword(password!);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (!email || !username || !password) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Missing required fields');
    }
     await this._otpRepository.saveOtp({
      email,
      username,
      referredReferralCode: referredReferralCode || '',
      password: hashedPassword,
      otp,
      expiresAt,
      attempts: 0,
    });

    await sendOtpMail(email, otp);
  }

  async verifyOtpAndRegister(email: string, otp: string): Promise<void> {
    const isValidOtp = await this._otpRepository.verifyOtp(email, otp);
    if (!isValidOtp) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid OTP');
    }
    const otpDoc = await this._otpRepository.getOtpByEmail(email);
     if (!otpDoc || !otpDoc.username || !otpDoc.password) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Incomplete registration data');
    }
    const existing = await this._userRepository.findByEmail(email);

    if (existing) {
      throw new AppError(HttpStatus.CONFLICT, 'User already registered');
    }

    const referredReferralCode = otpDoc?.referredReferralCode;
     const referredBy = await this._userRepository.findUserByReferralCode(referredReferralCode!);
     const referralCode = await generateUniqueReferralCode();
    const newUser: IUser = {
      email,
      username: otpDoc.username,
      password: otpDoc.password,
      referralCode: referralCode,
      referredBy: referredBy?._id,
    };

    const user = await this._userRepository.createUser(newUser);
    if (!user || !user._id) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'User creation failed');
    }
    await this._otpRepository.deleteOtp(email);
    await this._walletRepository.createWallet(user._id.toString());

    const referralStatus = await this._referraRepository.getReferral();

    if (referredBy && referralStatus && !referralStatus.isBlocked && referralStatus.amount) {
      const amount = referralStatus.amount;

      await this._walletRepository.creditWallet(user._id.toString(), amount, 'Referral Reward');
      await this._walletRepository.creditWallet(
        user?.referredBy!.toString(),
        amount,
        'Referral Reward'
      );
    }
  }

  async resendOtp(email: string): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(HttpStatus.CONFLICT, 'Email already registered');
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.saveOtp({ email, otp, expiresAt });
    await sendOtpMail(email, otp);
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: LoginResponseDTO; accessToken: string; refreshToken: string }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(HttpStatus.UNAUTHORIZED,'Incorrect email or password');
    }
    if (user.isBlocked == true) {
      throw new AppError(HttpStatus.UNAUTHORIZED,'user is blocked please contact support');
    }

    if (!user.password) {
      throw new AppError(HttpStatus.BAD_REQUEST,'Incorrect email or password');
    }

    const isPasswordMatch = await comparePassword(password, user?.password);
    if (!isPasswordMatch) {
      throw new AppError(HttpStatus.BAD_REQUEST,'Incorrect email or password');
    }
    const payload = {
      id: user._id,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: UserMapper.mapToLoginResponseDTO(user),
      accessToken,
      refreshToken,
    };
  }

  async forgotPasswordOtp(email: string): Promise<void> {
    const existingEmail = await this._userRepository.findByEmail(email);
    if (!existingEmail) {
      throw new AppError(HttpStatus.NOT_FOUND,'User with this email does not exist');
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.saveOtp({ email, otp, expiresAt });
    await sendOtpMail(email, otp);
  }

  async verifyOtpForForgotPassword(email: string, otp: string): Promise<{ token: string }> {
    const isValidOtp = await this._otpRepository.verifyOtp(email, otp);
     if (!isValidOtp) {
      throw new AppError(HttpStatus.BAD_REQUEST,'Invalid OTP');
    }
    const payload = {
      email: email,
    };
    const token = generateAccessToken(payload);
    return { token };
  }

  async forgotPasswordChange(token: string, password: string): Promise<void> {
    const verifyToken = verifyAccessToken(token);
    if (!verifyToken) {
      throw new AppError(HttpStatus.UNAUTHORIZED,'Expired or Invalid Token');
    }

    const email = verifyToken.email;
     const hashedPassword = await hashPassword(password);

    await this._userRepository.updateUserPassword(email!, hashedPassword);
  }


  async loginWithGoole(token: string): Promise<{ accessToken: string; user: LoginResponseDTO }> {
    const { email, name, picture, googleId } = await verifyGoogleToken(token);

    if (!email) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Google account email not found');
    }

    // Check if the user already exists
    let user = await this._userRepository.findByEmail(email);
    const referralCode = await generateUniqueReferralCode();

    if (!user) {
      //  Ensure unique username
      let baseUsername = name?.replace(/\s+/g, '').toLowerCase(); // remove spaces
      let finalUsername = baseUsername;

      // check if username exists and create a unique one
      let count = 0;
      while (await this._userRepository.findByUsername(finalUsername!)) {
        count++;
        const randomNum = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
        finalUsername = `${baseUsername}_${randomNum}_${count}`;
      }

      //  Create new Google user
      user = await this._userRepository.createUser({
        email,
        username: finalUsername,
        referralCode,
        profileImage: picture ? { url: picture, public_id: 'google-oauth' } : undefined,
        googleId,
        isGoogleUser: true,
      });
    }

    //  Generate JWT access token
    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
    });

    return { accessToken, user: UserMapper.mapToLoginResponseDTO(user) };
  }


  async requestEmailChange(userId: string, newEmail: string): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(newEmail);
    if (existingUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Email already taken');
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.saveOtp({ email: newEmail, otp, expiresAt });
    await sendOtpMail(newEmail, otp);
  }

  async verifyAndUpdateEmail(
    userId: string,
    newEmail: string,
    otp: string
  ): Promise<UserBasicResponseDTO | null> {
    const isValidOtp = await this._otpRepository.verifyOtp(newEmail, otp);
    if (!isValidOtp) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid or expired OTP');
    }
    const user = await this._userRepository.updateUserEmail(userId, newEmail);
    return user ? UserMapper.toBasicResponse(user) : null;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user || !user.password) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }
    const isPasswordMatch = await comparePassword(currentPassword, user.password);
    if (!isPasswordMatch) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Incorrect current password');
    }
    const hashNewPassword = await hashPassword(newPassword);
    await this._userRepository.changePassword(userId, hashNewPassword);
  }

  async searchUsersForChat(
    userId: string,
    search: string,
    role: EnumUserRole
  ): Promise<UserBasicResponseDTO[] | null> {
    const user = await this._userRepository.searchUsersForChat(userId, search, role);
    return user ? user.map(UserMapper.toBasicResponse) : null;
  }
}
