export interface IOTP {
   email: string;
   username?:string;
   password?:string;
   attempts?:number;
  otp?: string;
  expiresAt?: Date;
  createdAt?: Date;
}
