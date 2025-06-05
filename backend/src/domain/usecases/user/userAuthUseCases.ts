import { IUserRepository } from '../../repositories/IUserRepository';
import { IOtpRepository } from '../../repositories/IOtpRepository';
import { sendOtpMail } from '@infrastructure/services/mail/mailer';
import { hashPassword,comparePassword } from '@shared/utils/hash';
import { IUser } from '../../entities/IUser';
import { generateOtp } from '@shared/utils/generateOtp';
import { generateAccessToken,generateRefreshToken } from '@shared/utils/jwt';
 export class UserAuthUsecases{
    constructor(
        private userRepository:IUserRepository,
        private otpRepository:IOtpRepository,
    ){}

    async preRegistration(email:string,username:string):Promise<void>{
        const existingEmail=await this.userRepository.findByEmail(email)
        if(existingEmail){
            throw new Error('Email already in use')
        }

        const existingUsername=await this.userRepository.findByUsername(username)
        if(existingUsername){
            throw new Error('Username already taken')
        }

        const otp=generateOtp()
        const expiresAt=new Date(Date.now()+5*60*1000)

        await this.otpRepository.saveOtp(email,otp,expiresAt)
        await sendOtpMail(email,otp)

    }

    async verifyOtpAndRegister(userData:IUser,otp:string):Promise<void>{
       const {email,password}=userData

       const isValidOtp=await this.otpRepository.verifyOtp(email,otp)
       if(!isValidOtp){
        throw new Error('Invalid or Expired OTP')
       }
       const hashedPassword=await hashPassword(password)
       const newUser={...userData,password:hashedPassword}

       await this.userRepository.createUser(newUser)
       await this.otpRepository.deleteOtp(email)
    }

async login(email:string,password:string):Promise<{ user: IUser; accessToken: string; refreshToken: string }>{
    const user=await this.userRepository.findByEmail(email)
    console.log(email,password,'em')
    if (!user) {
          console.log(email,password,'em')

      throw new Error('Incorrect email or password');
    }

    const isPasswordMatch=await comparePassword(password,user?.password)
    if(!isPasswordMatch){

        throw new Error('Incorrect email or password')
    }
     const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  //console.log(user._id,'id')
//console.log({payload._id,accessToken,refreshToken},'toekn')
    const publicUser={
        _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role
    }as IUser
  return { user:publicUser, accessToken, refreshToken };

}

    async forgotPasswordOtp(email:string):Promise<void>{
        const existingEmail=await this.userRepository.findByEmail(email)
        if(!existingEmail){
            throw new Error('User with this email does not exist')
        }
        const otp=generateOtp()
        const expiresAt=new Date(Date.now()+5*60*1000)

        await this.otpRepository.saveOtp(email,otp,expiresAt)
        await sendOtpMail(email,otp)

    }

    async forgotPasswordChange(userData:IUser,otp:string):Promise<void>{
       const {email,password}=userData

       const isValidOtp=await this.otpRepository.verifyOtp(email,otp)
       if(!isValidOtp){
        throw new Error('Invalid or Expired OTP')
       }
       const hashedPassword=await hashPassword(password)
 
       await this.userRepository.updateUserPassword (email,hashedPassword)
       await this.otpRepository.deleteOtp(email)
    }


}