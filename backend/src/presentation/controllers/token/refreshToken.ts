import { Request,Response } from "express";
import { verifyRefreshToken,generateAccessToken,generateRefreshToken } from "@shared/utils/jwt";


export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Read refresh token from cookie  
    const oldRefreshToken = req.cookies.refreshToken;
          console.log({oldRefreshToken},'from refresh')

    if (!oldRefreshToken) {
      console.log({oldRefreshToken})
       res.status(401).json({ message: 'No refresh token provided' });
       return
    }

    // Verify old refresh token
    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) {
       res.status(403).json({ message: 'Invalid refresh token' });
       return
    }
    console.log({payload,})

    // Create new tokens
    const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role });
    const newRefreshToken = generateRefreshToken({ id: payload.id, role: payload.role });
console.log({newAccessToken,newRefreshToken})
    // Send new refresh token as cookie 
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // Send new access token in response
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Could not refresh token' });
  }
};
