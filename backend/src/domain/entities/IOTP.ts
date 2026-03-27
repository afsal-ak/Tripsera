export interface IOTP {
  email: string;
  username?: string;
    phone?:number;

  password?: string;
  attempts?: number;
  referredReferralCode?: string;
  otp?: string;
  expiresAt?: Date;
  createdAt?: Date;
}
