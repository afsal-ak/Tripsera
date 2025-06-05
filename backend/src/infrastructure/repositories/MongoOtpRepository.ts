import { IOTP } from "@domain/entities/IOTP";
import { IOtpRepository } from "@domain/repositories/IOtpRepository";
import { OtpModel } from "@infrastructure/models/Otp";
 
export class MongoOtpRepository implements IOtpRepository{
   async saveOtp(email: string, otp: string,expiresAt:Date): Promise<void> {
       await OtpModel.deleteOne({email})
       await OtpModel.create({
        email,
        otp,
        expiresAt 
       })
   }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = await OtpModel.findOne({ email, otp })
        if (!record) {
            return false
        }

        return record.expiresAt>new Date()


    }

   async deleteOtp(email: string): Promise<void> {
       await OtpModel.deleteOne({email})
   }

}