import { Request } from "express";
import { AppError } from "./AppError";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
  
export const getCompanyIdFromRequest =  (req: Request): string => {
   const companyId = req.user?.companyId;
   
  if (!companyId) {
    console.log(companyId,'get companyId');
    
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  return companyId.toString();
};