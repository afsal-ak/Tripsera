import { IUser } from '@domain/entities/IUser';
import { EnumUserRole } from '@constants/enum/userEnum';
import { UserModel } from '@infrastructure/models/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { AppError } from '@shared/utils/AppError';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class UserRepository implements IUserRepository {
  async getAllAdmins(): Promise<IUser[]> {
    return await UserModel.find({ role: 'admin', isBlocked: false });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email });
    return user ? user.toObject() : null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username });
    return user ? user.toObject() : null;
  }

  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    const saved = await newUser.save();
    return saved.toObject();
  }

  async updateUserPassword(email: string, password: string): Promise<IUser | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { new: true }
    );
    console.log(UserModel, updatedUser, 'updated');
    return updatedUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user ? user.toObject() : null;
  }

  async addFollowerAndFollowing(followerId: string, followingId: string): Promise<void> {
    const follower = await UserModel.findById(followerId);
    const following = await UserModel.findById(followingId);

    if (!follower || !following) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const alreadyFollowing = following?.followers!.some(
      (id) => id.toString() === follower._id.toString()
    );

    if (alreadyFollowing) return;

    following.followers!.push(follower._id.toString());
    follower.following!.push(following._id.toString());

    await Promise.all([follower.save(), following.save()]);
  }

  async unFollowAndFollowing(followerId: string, followingId: string): Promise<void> {
    const follower = await UserModel.findById(followerId);
    const following = await UserModel.findById(followingId);

    if (!follower || !following) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    const isFollowing = following.followers!.some(
      (id) => id.toString() === follower._id.toString()
    );

    if (!isFollowing) return;
    following.followers = following.followers!.filter(
      (id) => id.toString() !== follower._id.toString()
    );

    follower.following = follower.following!.filter(
      (id) => id.toString() !== following._id.toString()
    );

    await Promise.all([follower.save(), following.save()]);
  }

  async findUserByReferralCode(referredReferralCode: string): Promise<IUser | null> {
    const referredBy = await UserModel.findOne({ referralCode: referredReferralCode });
    return referredBy;
  }
  async findAll(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ data: IUser[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;
    const matchStage: any = {};

    //  Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchRegex = { $regex: filters.search.trim(), $options: 'i' };
      matchStage.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { fullName: searchRegex },
      ];
    }

    if (filters.status === 'active') {
      matchStage.isBlocked = false;
    } else if (filters.status === 'blocked') {
      matchStage.isBlocked = true;
    }

    //  Fetch data + count in parallel
    const [users, total] = await Promise.all([
      UserModel.find(matchStage).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(matchStage),
    ]);

    //  Pagination info
    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: Math.floor(skip / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return {
      data: users,
      pagination,
    };
  }

  async findAllUnblockedUser(skip: number, limit: number): Promise<IUser[]> {
    return UserModel.find({ isBlocked: false }).skip(skip).limit(limit).select('-password').lean();
  }

  async countAll(): Promise<number> {
    return UserModel.countDocuments();
  }

  async updateUserStatus(id: string, isBlocked: boolean): Promise<void> {
    const user = await UserModel.findByIdAndUpdate(id, { isBlocked });
    return;
  }

  async updateUserEmail(id: string, email: string): Promise<IUser | null> {
    const checkEmail = await UserModel.findOne({ email: email });
    if (checkEmail) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Email Already taken');
    }
    const newEmail = await UserModel.findByIdAndUpdate(id, { email: email }, { new: true });
    return newEmail;
  }

  async changePassword(id: string, newPassword: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { password: newPassword });
  }

  async getUserProfile(id: string): Promise<IUser | null> {
    const userProfile = await UserModel.findById(id).select('-password').lean();
    return userProfile || null;
  }

  async updateProfileImage(
    id: string,
    profileImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, { profileImage }, { new: true }).lean();

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async createCoverImage(
    id: string,
    coverImage: { url: string; public_id: string }
  ): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, { coverImage }).lean();

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async updateUserProfile(id: string, profileData: Partial<IUser>): Promise<IUser | null> {
    const checkUsername = await UserModel.findOne({
      _id: { $ne: id },
      username: new RegExp(`^${profileData.username}$`, 'i'),
    });

    if (checkUsername) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Username is taken please try new one');
    }

    const updated = await UserModel.findByIdAndUpdate(id, profileData, {
      new: true,
    })
      .select('username email profileImage bio fullName gender dob phone')
      .lean();

    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }

    return updated;
  }

  async updateUserAddress(id: string, addressData: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: { address: addressData } },
      { new: true }
    ).lean();

    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }
    return updated;
  }

  async setProfilePrivacy(id: string, isPrivate: boolean): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isPrivate },
      { new: true, select: '_id isPrivate' }
    );
    return user;
  }

  async searchUsersForChat(userId: string, search: string, role: EnumUserRole): Promise<IUser[]> {
    const searchRegex = { $regex: search, $options: 'i' };

    // If admin → search all non-blocked users
    if (role === EnumUserRole.ADMIN) {
      const query: any = { isBlocked: false };

      // Apply regex only if search exists
      if (searchRegex) {
        query.$or = [{ username: searchRegex }, { fullName: searchRegex }];
      }

      return UserModel.find(query).select('_id username fullName profileImage role');
    }

    // For normal users → fetch only followed users + admins
    const currentUser = await UserModel.findById(userId).select('following');

    const query: any = {
      isBlocked: false,
      $or: [],
    };

    // If following users exist, add them to search
    if (currentUser?.following?.length) {
      const followingBlock: any = {
        _id: { $in: currentUser.following },
      };

      if (searchRegex) {
        followingBlock.$or = [{ username: searchRegex }, { fullName: searchRegex }];
      }

      query.$or.push(followingBlock);
    }

    // Always allow chatting with admins
    const adminBlock: any = { role: EnumUserRole.ADMIN };
    if (searchRegex) {
      adminBlock.$or = [{ username: searchRegex }, { fullName: searchRegex }];
    }

    query.$or.push(adminBlock);

    return UserModel.find(query).select('_id username fullName profileImage role');
  }

  async searchAllUsersForAdmin(search: string): Promise<IUser[]> {
    const searchRegex = { $regex: search, $options: 'i' };

    const query: any = { isBlocked: false };

    // Apply search condition only if a search term exists
    if (search && search.trim() !== '') {
      query.$or = [{ username: searchRegex }, { fullName: searchRegex }, { email: searchRegex }];
    }

    // Fetch users without role restrictions
    return UserModel.find(query)
      .select('_id username fullName profileImage email role')
      .sort({ createdAt: -1 })
      .limit(20);
  }


  // async newsLetterSubscribe(userId: string): Promise<IUser | null> {
  //   return await UserModel.findByIdAndUpdate(
  //     userId,
  //     { isNewsletterSubscribed: true },
  //     { new: true }
  //   );
  // }

  // async newsLetterUnsubscribe(userId: string): Promise<IUser | null> {
  //   return await UserModel.findByIdAndUpdate(
  //     userId,
  //     { isNewsletterSubscribed: false },
  //     { new: true }
  //   );
  // }
async updateNewsletterSubscription(userId: string, subscribed: boolean):Promise<IUser|null> {
  return await UserModel.findByIdAndUpdate(
    userId,
    { isNewsletterSubscribed: subscribed },
    { new: true }
  );
}

  async getAllNewsletterSubscribers(): Promise<IUser[]> {
    return await UserModel.find({ isNewsletterSubscribed: true });
  }
}
