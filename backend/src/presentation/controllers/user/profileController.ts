import { Request, Response, NextFunction } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { IUser } from '@domain/entities/IUser';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { mapToPublicProfileDTO } from '@application/dtos/PublicProfileDTO ';
import { IProfileUseCases } from '@application/useCaseInterfaces/user/IProfileUseCases';

export class ProfileController {
  constructor(private _profileUseCases: IProfileUseCases) {}

  getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const userProfile = await this._profileUseCases.getUserProfile(userId);

      res.status(HttpStatus.OK).json({
        userProfile,
        message: 'user profile fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { profileData }: { profileData: Partial<IUser> } = req.body;
      console.log(profileData, 'profile data');
      const updatedProfile = await this._profileUseCases.updateUserProfile(userId, profileData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'User profile updated successfully',
        userProfile: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const { address } = req.body;
      // console.log(address, 'adress data')
      const updatedAddress = await this._profileUseCases.updateUserAddress(userId, address);

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'User address updated successfully',
        userProfile: updatedAddress,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const imagePath = req.file?.path;
      if (!imagePath) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      const { url, public_id } = await uploadCloudinary(imagePath, 'profileImage');

      const profileImage = { url, public_id };

      const updatedUser = await this._profileUseCases.updateProfileImage(userId, profileImage);

      res.status(HttpStatus.CREATED).json({
        success: true,
        profileImage: updatedUser?.profileImage,
        message: 'Profile image uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  createCoverImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const imagePath = req.file?.path;
      if (!imagePath) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      const { url, public_id } = await uploadCloudinary(imagePath, 'coverImage');

      const coverImage = { url, public_id };

      const updatedUser = await this._profileUseCases.createCoverImage(userId, coverImage);

      res.status(HttpStatus.CREATED).json({
        success: true,
        profileImage: updatedUser?.coverImage,
        message: 'Cover image uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getPublicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const viewerId = getUserIdFromRequest(req);
      console.log(viewerId, 'user name in public');

      const { username } = req.params;
      console.log(username, 'user name in public');
      const user = await this._profileUseCases.getPublicProfile(username);
      const profile = mapToPublicProfileDTO(user!);
      const isFollowing = profile.followers.toString()?.includes(viewerId) ?? false;
      // console.log(isFollowing,'foollwoing')
      // console.log(profile.followers.toString(),'follwers')
      res.status(HttpStatus.OK).json({
        profile,
        isFollowing,
        message: 'Profile fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  followUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followingId = req.params.userId;
      console.log(followingId, 'following id');
      const followerId = getUserIdFromRequest(req);
      // const followingId = req.params.userId;
      // console.log(followingId,'following id')

      const result = await this._profileUseCases.followUser(followerId, followingId);

      res.status(200).json({ result, message: 'Followed successfully' });
    } catch (error) {
      next(error);
    }
  };

  unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followerId = getUserIdFromRequest(req);
      const followingId = req.params.userId;
      console.log(followingId, 'following id');

      const result = await this._profileUseCases.unfollowUser(followerId, followingId);

      res.status(200).json({ result, message: 'Unfollowed successfully' });
    } catch (error) {
      next(error);
    }
  };
}
