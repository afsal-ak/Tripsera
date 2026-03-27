import { NextFunction, Request, Response } from "express";
import { verifyRefreshToken, generateAccessToken } from "@shared/utils/jwt";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    // read refresh token from cookie
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "No refresh token provided" });
      return;
    }

    // verify refresh token
    const payload = verifyRefreshToken(oldRefreshToken);

    if (!payload) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Invalid refresh token" });
      return;
    }

    // create new access token
    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    next(error);
  }
};