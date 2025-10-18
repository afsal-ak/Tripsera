
import jwt, { SignOptions } from "jsonwebtoken";
import  { StringValue } from "ms";
import { getExpiryInSeconds } from "./getExpiryInSeconds";
import { JwtPayload } from "../../types/jwtPayload";  

 const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY  as StringValue;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY  as StringValue;


// Generate Access Token
export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: getExpiryInSeconds(ACCESS_TOKEN_EXPIRY) };
  return jwt.sign(payload, ACCESS_SECRET, options);
};

// Generate Refresh Token
export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: getExpiryInSeconds(REFRESH_TOKEN_EXPIRY) };
  return jwt.sign(payload, REFRESH_SECRET, options);
};

// Access token verify
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
};

// Refresh token verify
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};