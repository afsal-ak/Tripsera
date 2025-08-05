 
export interface IReferral{
  _id?:  string;
  amount:number;
  isBlocked:boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}