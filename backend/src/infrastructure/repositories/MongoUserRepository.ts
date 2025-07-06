import { Model } from "mongoose";
import { IUser } from "@domain/entities/IUser";
import { UserModel } from "@infrastructure/models/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IUserPreview } from "@domain/entities/IUserPreview ";
import { AppError } from "@shared/utils/AppError";
export class MongoUserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email })
    return user ? user.toObject() : null
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username })
    return user ? user.toObject() : null
  }

  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    const saved = await newUser.save()
    return saved.toObject()
  }

  async updateUserPassword(email: string, password: string): Promise<IUser | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { new: true }
    )
    console.log(UserModel, updatedUser, 'updated')
    return updatedUser
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  //   async findAll(): Promise<IUserPreview[]> {
  //  const users = await UserModel.find()
  //     .select("username email phoneNumber isBlocked")  
  //     .lean();
  //      return users as IUserPreview[]
  //   }

  async findAll(skip: number, limit: number): Promise<IUser[]> {
    return UserModel.find({})
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean();
  }

  async countAll(): Promise<number> {
    return UserModel.countDocuments();
  }

  async updateUserStatus(id: string, isBlocked: boolean): Promise<void> {
    const user = await UserModel.findByIdAndUpdate(id, { isBlocked })
    return
  }


  async updateUserEmail(id: string, email: string): Promise<IUser | null> {
    const checkEmail = await UserModel.findOne({ email: email })
    if (checkEmail) {
      throw new AppError(400, "Email Already taken")
    }
    const newEmail = await UserModel.findByIdAndUpdate(id, { email: email }, { new: true })
    return newEmail

  }

  async changePassword(id: string, newPassword: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { password: newPassword })
  }

  async getUserProfile(id: string): Promise<IUser | null> {
    const userProfile = await UserModel.findById(id)
    return userProfile ? userProfile.toObject() : null

  }

  async updateProfileImage(id: string, profileImage: { url: string; public_id: string }): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    ).lean();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateUserProfile(id: string, profileData: Partial<IUser>): Promise<IUser | null> {
    const checkUsername = await UserModel.findOne({
      _id: { $ne: id },
      username: new RegExp(`^${profileData.username}$`, 'i')
    })

    if (checkUsername) {
      throw new AppError(400, "Username is taken please try new one")
    }
    const updated = await UserModel.findByIdAndUpdate(id, profileData, { new: true }).lean();
    if (!updated) {
      throw new AppError(404, "User not found");
    }
    return updated;
  }


}