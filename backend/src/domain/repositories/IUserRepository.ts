import { IUserPreview } from '@domain/entities/IUserPreview ';
import { IUser } from '../entities/IUser'
 
export interface IUserRepository{
    findByEmail(email:string):Promise<IUser|null>
    findByUsername(username:string):Promise<IUser|null>;
    createUser(user:IUser):Promise<IUser>
    updateUserPassword (email:string,password:string):Promise<IUser|null>
    findById(id:string):Promise<IUser|null>
    findAll(skip:number,limit:number): Promise<IUser[]>
    countAll():Promise<number>
    updateUserStatus(id:string,isBlocked:boolean):Promise<void>

}