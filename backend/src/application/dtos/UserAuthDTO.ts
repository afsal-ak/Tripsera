import { EnumUserRole } from '@constants/enum/userEnum';
import { IUser } from '@domain/entities/IUser';

export interface PreRegistrationDTO {
  email:string,
  username:string,
  password:string,
  referredReferralCode?:string,
}



export interface LoginResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: EnumUserRole;
  fullName?: string;
  phone?: number;
  profileImage?: { url: string; public_id: string };


}


export const mapToLoginResponseDTO = (user: IUser): LoginResponseDTO => ({
  _id: user._id!.toString(),
  username: user.username || '',
  email: user.email,
  role:  user.role || EnumUserRole.USER,

  profileImage: user.profileImage,
  fullName: user.fullName,
  phone: user.phone,
});

