import { IOTP } from "@domain/entities/IOTP";



export interface IOtpRepository {
  saveOtp(email: string, otp: string,expiresAt:Date): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  deleteOtp(email: string): Promise<void>;
}