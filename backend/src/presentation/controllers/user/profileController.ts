import { Request, Response, NextFunction } from "express";
import { ProfileUseCases } from "@domain/usecases/user/profileUseCases";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";
import { IUser } from "@domain/entities/IUser";
import { uploadCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";

export class ProfileController {
    constructor(private profileUseCases: ProfileUseCases) { }

    getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req)
            const userProfile = await this.profileUseCases.getUserProfile(userId)

            res.status(200).json({
                userProfile,
                message: "user profile fetched successfully"
            })


        } catch (error) {
            next(error)
        }
    }

    updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req)
            const { profileData }: { profileData: Partial<IUser> } = req.body
            console.log(profileData, 'profile data')
            const updatedProfile = await this.profileUseCases.updateUserProfile(userId, profileData)

            res.status(200).json({
                success: true,
                message: "User profile updated successfully",
                userProfile: updatedProfile,
            });

        } catch (error) {
            next(error)
        }
    }

    updateProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserIdFromRequest(req)
            const imagePath = req.file?.path
            if (!imagePath) {
                res.status(400).json({ success: false, message: "No file uploaded" });
                return;
            }

            const { url, public_id } = await uploadCloudinary(imagePath, 'profileImage');

            const profileImage = { url, public_id }

             const updatedUser = await this.profileUseCases.updateProfileImage(userId, profileImage)

            res.status(200).json({
                success: true,
                profileImage: updatedUser?.profileImage,
                message: 'Profile image uploaded successfully',
            });
        } catch (error) {
            next(error)
        }
    }

}
