import { NextFunction, Request, Response } from 'express';
import { verifyRefreshToken, generateAccessToken } from '@shared/utils/jwt';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export const userRefreshToken = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  try {
    // Read refresh token from cookie
    const oldRefreshToken = req.cookies.userRefreshToken;

    if (!oldRefreshToken) {
      console.log({ oldRefreshToken });
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token provided' });
      return;
    }

    // Verify old refresh token
    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid refresh token' });
      return;
    }

    // Create new tokens
    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
    });

    // Send new access token in response
    res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error)
  }
};
