import { IUser } from "@domain/entities/IUser";
import { MongoUserRepository } from "@infrastructure/repositories/MongoUserRepository";

export class ProfileUseCases{
    constructor(private userRepo:MongoUserRepository){}

    async getUserProfile(userId:string):Promise<IUser|null>{
        return await this.userRepo.getUserProfile(userId)
    }

    async updateProfileImage(userId:string,profileImage: { url: string; public_id: string }):Promise<IUser|null>{
        return await this.userRepo.updateProfileImage(userId,profileImage)
    }

    async updateUserProfile(userId:string,profileData:Partial<IUser>):Promise<IUser|null>{
        return await this.userRepo.updateUserProfile(userId,profileData)
    }

    async updateUserAddress(userId:string,addressData:Partial<IUser>):Promise<IUser|null>{
        return await this.userRepo.updateUserAddress(userId,addressData)
    }




}