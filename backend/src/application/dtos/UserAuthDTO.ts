import { IUser } from '@domain/entities/IUser';

export interface LoginResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  fullName?: string;
  phone?:number;
  profileImage?: { url: string; public_id: string };


}

export const mapToLoginResponseDTO = (user: IUser): LoginResponseDTO => ({
  _id: user._id!.toString(),
  username: user.username || '',
  email: user.email,
  role: user.role || 'user',

  profileImage: user.profileImage,
  fullName: user.fullName,
  phone: user.phone,
});
