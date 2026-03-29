import { Request } from "express";
import { AppError } from "./AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { UserModel } from "@infrastructure/models/User";
 
export const getCompanyIdFromRequest = async (req: Request): Promise<string> => {
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  // 🔥 Find user with companyId
  const user = await UserModel.findById(userId).select("companyId");

  if (!user || !user.companyId) {
    throw new AppError(HttpStatus.NOT_FOUND, "Company not found for this user");
  }

  return user.companyId.toString();
};