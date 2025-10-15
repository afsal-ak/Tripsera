import { EnumUserRole } from '@constants/enum/userEnum';
import { IUser} from '../entities/IUser';
import { IFilter } from '@domain/entities/IFilter';

import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;
  updateUserPassword(email: string, password: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(page: number, limit: number,filter:IFilter): Promise<IPaginatedResult<IUser>>;
  countAll(): Promise<number>;
  updateUserStatus(id: string, isBlocked: boolean): Promise<void>;
  updateUserEmail(id: string, email: string): Promise<IUser | null>;
  changePassword(id: string, newPassword: string): Promise<IUser | null>;
  findUserByReferralCode(referredReferralCode: string): Promise<IUser | null>;
  getAllAdmins(): Promise<IUser[]>;

  updateUserProfile(id: string, profileData: Partial<IUser>): Promise<IUser | null>;
  updateUserProfile(id: string, addressData: Partial<IUser>): Promise<IUser | null>;
  updateProfileImage(
    id: string,
    profileImage: { url: string; public_id: string }
  ): Promise<IUser | null>;
  createCoverImage(
    id: string,
    coverImageImage: { url: string; public_id: string }
  ): Promise<IUser | null>;
  getUserProfile(id: string): Promise<IUser | null>;
  setProfilePrivacy(id:string,isPrivate:boolean):Promise<IUser | null>
   searchUsersForChat(
    userId: string,
    search: string,
    role:EnumUserRole
  ): Promise<IUser[]>   
     searchAllUsersForAdmin(search: string): Promise<IUser[]> 

   updateUserAddress(userId: string, addressData: Partial<IUser>): Promise<IUser | null> 
   addFollowerAndFollowing(followerId: string, followingId: string): Promise<void> 
   unFollowAndFollowing(followerId: string, followingId: string): Promise<void> 
  
}
