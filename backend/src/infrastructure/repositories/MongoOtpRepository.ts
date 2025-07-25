import { IOTP } from '@domain/entities/IOTP';
import { IOtpRepository } from '@domain/repositories/IOtpRepository';
import { OtpModel } from '@infrastructure/models/Otp';

export class MongoOtpRepository implements IOtpRepository {
  async saveOtp(data: IOTP): Promise<void> {
    await OtpModel.deleteOne({ email: data.email });
    await OtpModel.create({
      email: data.email,
      username: data.username,
      password: data.password,
      otp: data.otp,
      expiresAt: data.expiresAt,
      attempts: data.attempts ?? 0,
    });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await OtpModel.findOne({ email });

    if (!record || !record.expiresAt || record.attempts === undefined) {
      return false;
    }

    // Check if OTP expired
    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ email }); // Optional cleanup
      throw new Error('OTP Expired');
    }

    // Check if attempts exceed limit
    if (record.attempts >= 5) {
      await OtpModel.deleteOne({ email });
      throw new Error('Too many attempts');
    }

    if (record.otp !== otp) {
      await OtpModel.updateOne({ email }, { $inc: { attempts: 1 } });
      throw new Error('Invalid OTP');
    }

    return true;
  }

  async getOtpByEmail(email: string): Promise<IOTP | null> {
    return await OtpModel.findOne({ email });
  }

  async deleteOtp(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }
}
