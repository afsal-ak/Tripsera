export interface IOTP {
  email: string;
  username?: string;
  password?: string;
  attempts?: number;
  referredReferralCode?: string;
  otp?: string;
  expiresAt?: Date;
  createdAt?: Date;
}
