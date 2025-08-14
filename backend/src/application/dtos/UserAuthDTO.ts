import { IUser } from '@domain/entities/IUser';

export interface LoginResponseDTO {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
  profileImage?: { url: string; public_id: string };
  fullName?: string;
}

export const mapToLoginResponseDTO = (user: IUser, token: string): LoginResponseDTO => ({
  _id: user._id!.toString(),
  username: user.username || '',
  email: user.email,
  role: user.role || 'user',
  token,
  profileImage: user.profileImage,
  fullName: user.fullName,
});
