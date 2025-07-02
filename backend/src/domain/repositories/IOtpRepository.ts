import { IOTP } from "@domain/entities/IOTP";



export interface IOtpRepository {
  saveOtp(data: IOTP): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  getOtpByEmail(email: string): Promise<IOTP | null>;
  deleteOtp(email: string): Promise<void>;
}